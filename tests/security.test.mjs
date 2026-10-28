import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import bcrypt from 'bcryptjs';

const nodeRequire = createRequire(import.meta.url);

// Load production TS modules with explicit infrastructure doubles; no database writes.
function loadTs(relative, mocks = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const source = fs.readFileSync(filename, 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const localRequire = id => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith('@/')) return load(path.resolve('src', `${id.slice(2)}.ts`));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), `${id}.ts`));
      return nodeRequire(id);
    };
    vm.runInThisContext(`(function(require,module,exports){${outputText}\n})`, { filename })(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load(path.resolve(relative));
}

function loadCredentials({ user, check = async () => {} }) {
  let queries = 0;
  const service = loadTs('src/server/services/auth/authUserService.ts', {
    '@/server/db/auth/client': { prisma: { user: { findFirst: async () => { queries++; return user; } } } },
    '@/server/security/rateLimiter': { RateLimiter: () => ({ check }) },
  });
  return { authorize: service.authorizeWithCredentialsService, queries: () => queries };
}

test('direct credentials authorization consumes the limit before looking up the user', async () => {
  const keys = [];
  const { authorize, queries } = loadCredentials({ check: async key => { keys.push(key); throw { status: 429 }; } });
  await assert.rejects(authorize({ email: ' Admin@Example.com ', password: 'wrong' }), error => error.status === 429);
  assert.deepEqual(keys, ['admin@example.com']);
  assert.equal(queries(), 0);
});

test('legacy shared passwords, passwordless accounts, and soft-deleted users cannot authenticate', async () => {
  const password = await bcrypt.hash('sert', 4);
  for (const user of [{ id: 'a', password }, { id: 'b', password: null }, { id: 'c', password, deletedAt: new Date() }]) {
    const { authorize } = loadCredentials({ user });
    assert.equal(await authorize({ email: 'test@example.com', password: 'sert' }), null);
  }
});

test('valid credentials continue to authenticate with current roles', async () => {
  const password = await bcrypt.hash('unique-example-password', 4);
  const { authorize } = loadCredentials({ user: { id: 'user-1', email: 'test@example.com', password, role: { name: 'user' } } });
  const user = await authorize({ email: 'test@example.com', password: 'unique-example-password' });
  assert.equal(user.id, 'user-1');
  assert.equal(user.role, 'user');
});

test('admin-created users have no shared credentials password', async () => {
  let created;
  const { userService } = loadTs('src/server/services/userService.ts', {
    '@/server/db/auth/client': { prisma: {
      role: { findFirst: async () => ({ id: 'role-user' }) },
      user: { findUnique: async () => null, create: async input => { created = input.data; return input.data; } },
    } },
  });
  await userService.create({ name: 'Example', email: 'example@example.com', role: 'user' });
  assert.equal(created.password, null);
});

async function authCallbacks(findUnique) {
  const { auth } = loadTs('src/server/services/auth/authService.ts', {
    'next-auth': { __esModule: true, default: config => ({ auth: config }) },
    'next-auth/providers/google': { __esModule: true, default: () => ({}) },
    'next-auth/providers/github': { __esModule: true, default: () => ({}) },
    'next-auth/providers/credentials': { __esModule: true, default: () => ({}) },
    '@auth/prisma-adapter': { PrismaAdapter: () => ({}) },
    '@/server/db/auth/client': { prisma: { user: { findUnique } } },
    '@/server/services/auth/authUserService': { authUserService: {}, authorizeWithCredentialsService: () => null },
    './sessionSettings': { getSessionMaxAgeSeconds: async () => 3000 },
  });
  return (await auth()).callbacks;
}

test('existing sessions immediately pick up demoted roles from the database', async () => {
  let lookup;
  const callbacks = await authCallbacks(async input => { lookup = input; return { id: '1', email: 'a@example.com', role: { name: 'user' } }; });
  const token = await callbacks.jwt({ token: { id: '1', role: 'admin' } });
  assert.equal(lookup.where.id, '1');
  assert.equal(token.role, 'user');
});

test('deleted and soft-deleted users lose their existing JWT sessions', async () => {
  for (const user of [null, { id: '1', deletedAt: new Date(), role: { name: 'admin' } }]) {
    const callbacks = await authCallbacks(async () => user);
    assert.equal(await callbacks.jwt({ token: { id: '1', role: 'admin' } }), null);
  }
});

test('database rate-limit rejection is a typed 429 and identities are hashed', async () => {
  let query;
  const { RateLimiter } = loadTs('src/server/security/rateLimiter.ts', {
    '@/server/db/auth/client': { prisma: { $queryRaw: async (sql, ...values) => { query = { sql: sql.join('?'), values }; return []; } } },
  });
  await assert.rejects(RateLimiter(5, 60, 'credentials').check('private@example.com'), error => error.status === 429 && error.code === 'RATE_LIMITED');
  assert.match(query.values[0], /^[a-f0-9]{64}$/);
  assert.ok(!query.sql.includes('private@example.com'));
  assert.match(query.sql, /ON CONFLICT/);
});

test('limiter uses shared identity buckets across instances and separates namespaces', async () => {
  const keys = [];
  const { RateLimiter } = loadTs('src/server/security/rateLimiter.ts', {
    '@/server/db/auth/client': { prisma: {
      $queryRaw: async (_sql, key) => { keys.push(key); return [{ count: 1 }]; },
      $executeRaw: async () => 0,
    } },
  });
  await RateLimiter(5, 60, 'credentials').check('same-user');
  await RateLimiter(5, 60, 'credentials').check('same-user');
  await RateLimiter(30, 60, 'sensor:pm25').check('same-user');
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});

test('session settings read saved values across calls and reject invalid writes', async () => {
  let saved = null;
  const { getSessionMaxAgeSeconds, saveSessionMaxAgeSeconds } = loadTs('src/server/services/auth/sessionSettings.ts', {
    '@/server/db/auth/client': { prisma: {
      $queryRaw: async sql => sql.join("").includes("to_regclass") ? [{ exists: true }] : saved === null ? [] : [{ value: saved }],
      $executeRaw: async (_sql, value) => { saved = value; },
    } },
  });
  await saveSessionMaxAgeSeconds(7200);
  assert.equal(await getSessionMaxAgeSeconds(), 7200);
  assert.equal(await getSessionMaxAgeSeconds(), 7200);
  for (const value of [0, -1, 1.5, 59, 2592001, NaN]) {
    await assert.rejects(saveSessionMaxAgeSeconds(value));
  }
  assert.equal(saved, '7200');
});

test('both sensor endpoints preserve rate-limit status codes', async () => {
  for (const device of ['xy-md02', 'pm25']) {
    const { POST } = loadTs(`src/app/api/sensors/${device}/route.ts`, {
      'next/server': { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } },
      '@/server/security/rateLimiter': { RateLimiter: () => ({ check: async () => { throw { name: 'AppError', status: 429, message: 'Too many requests', code: 'RATE_LIMITED' }; } }) },
      '@/server/services/sensorReadingService': {},
      '@/server/services/pm25ReadingService': {},
    });
    const originalKey = process.env.SMART_HOME_API_KEY;
    try {
      process.env.SMART_HOME_API_KEY = 'test-only-key';
      const response = await POST({ headers: new Headers({ 'x-api-key': 'test-only-key' }) });
      assert.equal(response.status, 429);
    } finally {
      if (originalKey === undefined) delete process.env.SMART_HOME_API_KEY;
      else process.env.SMART_HOME_API_KEY = originalKey;
    }
  }
});

test('protected actions reject absent sessions and demoted roles before running mutations', async () => {
  for (const session of [null, { user: { id: '1', role: 'user' } }]) {
    let mutated = false;
    const { withAuthAction } = loadTs('src/server/security/safeAction.ts', {
      '@/server/services/auth/authService': { auth: async () => session },
    });
    const action = withAuthAction(async () => { mutated = true; }, { roles: ['admin'] });
    await assert.rejects(action(), /Unauthorized|Forbidden/);
    assert.equal(mutated, false);
  }
});

test('settings read falls back before querying an undeployed AppSetting table', async () => {
  let calls = 0;
  const { getSessionMaxAgeSeconds } = loadTs('src/server/services/auth/sessionSettings.ts', {
    '@/server/db/auth/client': { prisma: { $queryRaw: async sql => {
      calls++;
      assert.match(sql.join(''), /to_regclass/);
      return [{ exists: false }];
    } } },
  });
  assert.ok(await getSessionMaxAgeSeconds() >= 60);
  assert.equal(calls, 1);
});

test('settings read handles Prisma and nested adapter missing-table errors during rollout', async () => {
  for (const error of [
    { code: 'P2010', meta: { code: '42P01' } },
    { code: 'P2010', meta: { driverAdapterError: { cause: { originalCode: '42P01' } } } },
    { cause: { code: '42P01' } },
  ]) {
    const { getSessionMaxAgeSeconds } = loadTs('src/server/services/auth/sessionSettings.ts', {
      '@/server/db/auth/client': { prisma: { $queryRaw: async sql => {
        if (sql.join('').includes('to_regclass')) return [{ exists: true }];
        throw error;
      } } },
    });
    assert.ok(await getSessionMaxAgeSeconds() >= 60);
  }
});

test('settings read still rejects connection and permission failures', async () => {
  for (const error of [new Error('database unavailable'), { meta: { code: '42501' } }]) {
    const { getSessionMaxAgeSeconds } = loadTs('src/server/services/auth/sessionSettings.ts', {
      '@/server/db/auth/client': { prisma: { $queryRaw: async () => { throw error; } } },
    });
    await assert.rejects(getSessionMaxAgeSeconds(), caught => caught === error);
  }
});

test('missing rate-limit storage fails closed instead of admitting a login', async () => {
  const { RateLimiter } = loadTs('src/server/security/rateLimiter.ts', {
    '@/server/db/auth/client': { prisma: { $queryRaw: async () => { throw new Error('storage unavailable'); } } },
  });
  await assert.rejects(RateLimiter(5, 60, 'credentials').check('a@example.com'), /storage unavailable/);
});
