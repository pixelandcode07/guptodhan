## Purpose

This file gives AI coding agents the minimal, focused context required to be productive in the Guptodhan monorepo (Next.js + TypeScript). It highlights the architecture, developer commands, conventions, integration points, and concrete examples to follow when making changes.

## Big picture

- This is a Next.js 16 (app dir) TypeScript application with a monolithic layout: frontend pages/components under `src/app` and `src/components`, and server-side API logic and domain modules under `src/lib` and `src/app/api`.
- API routes follow the new Next `app`-directory route.ts pattern under `src/app/api/v1/...`. Domain logic is implemented in `src/lib/modules/{module}` using the controller/service/model/validation split.
- Data + state: MongoDB (mongoose) via `src/lib/db.ts`, Redis via `src/lib/redis.ts`, Firebase (client keys in `src/lib/firebase.ts`) and server Firebase admin in `src/lib/firebaseAdmin.ts` (service account). Socket server lives at `src/pages/api/socket.ts`.

## Key files & locations (quick reference)

- Frontend app: `src/app/*` (pages, components, layout.tsx, globals.css)
- UI primitives: `src/components/ui/*` (shadcn-like tokens and components)
- Domain modules (server logic): `src/lib/modules/{name}/` (controller.service.model.validation)
- API entrypoints: `src/app/api/v1/{resource}/route.ts` (these call module services)
- DB connection: `src/lib/db.ts` (expects MONGODB_URI; throws if missing)
- Redis: `src/lib/redis.ts` (REDIS_HOST/PORT/USERNAME/PASSWORD)
- Firebase client config: `src/lib/firebase.ts` (uses NEXT_PUBLIC_* keys)

## Developer workflows (exact commands)

- Install: repo includes `pnpm-lock.yaml` but you can use npm/yarn/pnpm. Typical commands:
  - Install: `pnpm install` or `npm install`
  - Dev: `npm run dev` (runs `next dev --turbopack`) — you'll see hot-reload + Turbopack
  - Build: `npm run build` (`next build --turbopack`)
  - Start (production): `npm run start` (`next start`)
  - Lint: `npm run lint` (`eslint`)

Note: There are no test scripts present in package.json; the repo currently doesn't include automated tests.

## Environment vars and integration notes

- MongoDB: MONGODB_URI (see `src/lib/db.ts`) — `dbConnect()` is imported by APIs; .env.local is expected for local dev.
- Redis: REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD (see `src/lib/redis.ts`).
- Firebase client keys (public): NEXT_PUBLIC_apiKey, NEXT_PUBLIC_authDomain, NEXT_PUBLIC_projectId, NEXT_PUBLIC_storageBucket, NEXT_PUBLIC_messagingSenderId, NEXT_PUBLIC_appId (see `src/lib/firebase.ts`).
- Next Auth / JWT / Email: credentials and secrets are stored via env; check `src/lib/utils/jwt.ts`, `src/lib/email-templates`, and `src/app/api/auth` routes.

## Conventions & patterns to follow (concrete)

- Domain module layout: when adding a new resource follow `src/lib/modules/{name}/` and implement the 5-file pattern where applicable: `{name}.controller.ts`, `{name}.service.ts`, `{name}.model.ts`, `{name}.validation.ts`, `{name}.interface.ts`.
- API wiring: mirror the module path under `src/app/api/v1/{name}/route.ts` and call the service functions from the controller or route handler. Example: `src/app/api/v1/brands/route.ts` uses `src/lib/modules/brand/brand.service.ts`.
- UI: share atomic components in `src/components/ui`. Tables use `src/components/TableHelper/*` column definitions (pattern: a columns file per table). When adding a table column file follow the same naming scheme (e.g., `product_columns.tsx`).
- Error handling: server-side helpers exist under `src/lib/middlewares` (`catchAsync.ts`, `checkRole.ts`) and responses go through `src/lib/utils/sendResponse.ts` — reuse them for consistency.

## Integration points & pitfalls

- DB connect: `dbConnect()` throws if MONGODB_URI missing — ensure envs are set before running API routes.
- Firebase: client keys are public (NEXT_PUBLIC_) and used on client code; server Firebase admin may need a service account (check `src/lib/firebaseAdmin.ts`).
- Socket.io: server socket implemented in `src/pages/api/socket.ts` (if modifying, be careful with serverless/adapters and persistent state).
- Turbopack: dev/build scripts pass `--turbopack`. If you see unexpected bundling issues try removing the flag temporarily or use `next dev` without it.

## Quick examples for common tasks

- Add a new backend resource "foo":
  1. Create `src/lib/modules/foo/foo.service.ts` and other module files (controller/model/validation).
  2. Create API handler `src/app/api/v1/foo/route.ts` that imports the service and calls `dbConnect()` where needed.
  3. Add types in `src/types` if needed.

- Add a new UI component used across the app:
  1. Place atom in `src/components/ui/` (follow existing naming and props patterns).
  2. Add Story / example usage inside a page under `src/app` for manual verification.

## When to ask for human help

- Missing envs for DB/Redis/Firebase or authentication failures.
- Broad refactors of module boundaries (e.g., moving from controller/service pattern).

---
If you want, I can expand specific examples (walk-through of adding a brand module, or a sample API route). Which section would you like expanded?
