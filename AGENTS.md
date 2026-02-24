# AGENTS

## Project Start Commands

```bash
npm install
npm run dev
```

## Prisma Commands

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
npx tsx prisma/seed.ts
```

## Development Rules

- Make small commits with a single purpose per change.
- Do not modify unrelated files.
- Keep TypeScript types strict and avoid `any`.
- Split data logic and page logic for new features instead of putting everything in one file.

## Quality Gate

- `npm run lint` must pass before delivery.
