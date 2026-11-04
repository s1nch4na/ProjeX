# ProjeX

## Google authentication and challenge administration

Google Sign-In uses Google Identity Services in the Vite frontend and verified
Google ID tokens in the Express backend. New accounts must use Google; the
existing email/password login remains available for legacy accounts.

Configure these variables without committing them:

- **Vercel:** `VITE_GOOGLE_CLIENT_ID` (the Google OAuth Web client ID) and
  `VITE_API_URL` (the deployed backend URL).
- **Render/backend:** `GOOGLE_CLIENT_ID` (the same Web client ID),
  `JWT_SECRET`, `DATABASE_URL`, and `ADMIN_EMAILS` (a comma-separated list of
  approved team email addresses, for example `team-member@example.com`).

Google Cloud Console setup:

1. Configure the OAuth consent screen.
2. Create an OAuth client ID for a **Web application**.
3. Add the deployed Vercel origin and local development origin to Authorized
   JavaScript origins.
4. Set the client ID in Vercel and Render, then redeploy both services.

The backend verifies the token audience and `email_verified` claim. It derives
the ProjeX role for new accounts from the selected onboarding role, preserves
the role for existing accounts, and derives admin permission from the verified
email plus `ADMIN_EMAILS`. Challenge administration remains protected by the
backend on every request.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
