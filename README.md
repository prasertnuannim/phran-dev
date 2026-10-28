This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Requires Node.js 20.9 or newer. The app uses Next.js 16.4.3.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Security changes and deployment

The auth database now also stores `RateLimitBucket` (shared, atomic request limits)
and `AppSetting` (persistent session lifetime). Before starting this version,
apply the auth migration `20261027000100_security_settings` to the intended database.
Inspect pending migrations first; older migrations in this repository contain
unrelated schema changes and should not be applied blindly to an existing database.
For a database with all prior migrations applied:

```bash
npx prisma migrate status
npx prisma migrate deploy
npm run test
npm run lint
npx tsc --noEmit
```

`DATABASE_URL` is the auth database; `DATABASE_URL_SENSOR` is separate. Do not run
the sensor migration command for these auth tables. Session settings are shared
across instances and survive restarts; valid lifetimes are 1–43200 minutes.
Existing tokens retain their issued expiry, while newly issued tokens use the
saved lifetime. Deleted users and role changes are checked on every server
session read. Middleware only checks token presence; protected layouts and server
actions enforce current database permissions.

Admin-created accounts no longer receive a default password. They sign in with
Google or GitHub using the account email. Credentials login explicitly rejects
the former shared password, including for existing accounts. Accounts that relied
on that password need to use OAuth or have a unique password provisioned through
a trusted account recovery process. The new code does not alter existing user
records or email anyone automatically.

`npm test` runs isolated regression tests with infrastructure doubles. These tests
do not connect to the configured database. They cover credential entry points,
revocation, settings validation/persistence calls, and rate-limit API responses;
actual concurrent PostgreSQL behavior still requires a staging integration check.

## Production build

Run `npm run build` (Turbopack). In environments that restrict local worker ports, use `npm run build -- --webpack`. Public routing and authentication checks live in `src/proxy.ts`.
