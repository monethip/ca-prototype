# ca-prototype

Payment Portal Integration Flow with an Existing Certificate Authority (CA).

This prototype is a React + Vite app, organized by feature slice:

- `src/app` — router and global styles
- `src/features/landing` — marketing home
- `src/features/auth` — login and session
- `src/features/certificates` — certificate list and pricing
- `src/features/checkout` — plan, billing, QR payment
- `src/features/invoices` — invoice and payment history
- `src/features/portal` — logged-in shell that composes the slices
- `src/shared` — shared format helpers

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL, then go to **Log in**. Any email and password issues a session and opens the portal.

## Production build

```bash
npm run build
npm run preview
```

GitHub Pages deploys `dist/` from `main`. The Vite `base` path is `/ca-prototype/`.
