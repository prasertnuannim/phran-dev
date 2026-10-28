import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
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


test('each public page has localized canonical, social URL, title, and language alternatives', async () => {
  for (const language of ['th', 'en', 'zh']) {
    const { publicMetadata } = loadTs('src/lib/publicMetadata.ts', {
      'next/headers': { headers: async () => new Headers({ 'x-public-language': language }) },
    });
    for (const page of ['home', 'about', 'architecture']) {
      const result = await publicMetadata(page);
      const expected = `/${language}${page === 'home' ? '' : '/' + page}`;
      assert.equal(result.alternates.canonical, expected);
      assert.equal(result.openGraph.url, expected);
      assert.equal(result.openGraph.title, result.title.absolute);
      assert.equal(result.twitter.description, result.description);
      assert.equal(Object.keys(result.alternates.languages).length, 4);
      assert.ok(result.description.length > 0);
    }
  }
});

test('public language falls back safely when the header is missing or unsupported', async () => {
  for (const value of ['', 'xx']) {
    const { getPublicLanguage } = loadTs('src/lib/publicMetadata.ts', {
      'next/headers': { headers: async () => new Headers({ 'x-public-language': value }) },
    });
    assert.equal(await getPublicLanguage(), 'th');
  }
});

test('login validation returns translatable codes without calling authentication', async () => {
  const { loginUser } = loadTs('src/app/actions/loginForm.ts', {
    '@/server/services/auth/authService': { signIn: () => { throw new Error('must not authenticate'); } },
  });
  const result = await loginUser(null, new FormData());
  assert.equal(result.errors.email, 'LOGIN_EMAIL_INVALID');
  assert.equal(result.errors.password, 'LOGIN_PASSWORD_REQUIRED');
  const { translations } = loadTs('src/components/sections/translations.ts');
  for (const code of Object.values(result.errors)) {
    for (const language of ['th', 'en', 'zh']) assert.ok(translations[code][language]);
  }
});

test('login failure and rate limiting return safe, translated error codes', async () => {
  for (const [error, code] of [
    [{ name: 'AppError', code: 'RATE_LIMITED', message: 'Too many requests' }, 'LOGIN_RATE_LIMITED'],
    [new Error('sensitive backend detail'), 'LOGIN_FAILED'],
  ]) {
    const { loginUser } = loadTs('src/app/actions/loginForm.ts', {
      '@/server/services/auth/authService': { signIn: async () => { throw error; } },
    });
    const data = new FormData();
    data.set('email', 'person@example.com');
    data.set('password', 'example-password');
    const result = await loginUser(null, data);
    assert.equal(result.errors.general, code);
  }
});

test('localized routes rewrite to public pages with trusted language headers', async () => {
  const { NextRequest } = nodeRequire('next/server');
  const { proxy } = loadTs('src/proxy.ts', {
    'next-auth/jwt': { getToken: async () => { throw new Error('public pages must not require auth'); } },
  });
  for (const language of ['th', 'en', 'zh']) {
    for (const page of ['', '/about', '/architecture']) {
      const response = await proxy(new NextRequest(`https://phran.dev/${language}${page}?ref=test`, {
        headers: { 'x-public-language': 'spoofed' },
      }));
      assert.equal(response.headers.get('x-middleware-rewrite'), `https://phran.dev${page || '/'}?ref=test`);
      assert.equal(response.headers.get('x-middleware-request-x-public-language'), language);
    }
  }
});

test('legacy URLs redirect with query intact and language preference is validated', async () => {
  const { NextRequest } = nodeRequire('next/server');
  const { proxy } = loadTs('src/proxy.ts', {
    'next-auth/jwt': { getToken: async () => null },
  });
  for (const [saved, expected] of [['en', 'en'], ['zh', 'zh'], ['invalid', 'th']]) {
    const response = await proxy(new NextRequest('https://phran.dev/about?ref=test', {
      headers: { cookie: `phran-language=${saved}` },
    }));
    assert.equal(response.headers.get('location'), `https://phran.dev/${expected}/about?ref=test`);
  }
  const response = await proxy(new NextRequest('https://phran.dev/images/example.png'));
  assert.equal(response.headers.get('x-middleware-next'), '1');
});
