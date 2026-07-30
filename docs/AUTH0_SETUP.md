# Auth0 React SDK setup

The React client uses the official `@auth0/auth0-react` SDK and starts Vite at exactly `http://localhost:5173` (`--strictPort`) to keep callback URLs stable.

## 1. Local frontend configuration

Copy `frontend/.env.example` to `frontend/.env`, retaining:

```env
VITE_AUTH0_DOMAIN=dev-q2hbezioi4vl4y0g.us.auth0.com
VITE_AUTH0_CLIENT_ID=IWrcVLB9kArIpSheWIBTGvcCFriYfrkR
```

Never add an Auth0 client secret to a Vite environment file.

## 2. Auth0 Dashboard configuration

In the Auth0 application **Settings**, add exactly these local development values:

| Field | Value |
| --- | --- |
| Allowed Callback URLs | `http://localhost:5173` |
| Allowed Logout URLs | `http://localhost:5173` |
| Allowed Web Origins | `http://localhost:5173` |

Save changes. Add the corresponding HTTPS URL for each production deployment before deploying.

## 3. Run

```bash
cd frontend
npm install
npm run dev
```

## Important integration boundary

The provider is installed without replacing the app's existing Express JWT flow. Before using Auth0 to authorize Express APIs, configure an Auth0 API audience and validate Auth0 access tokens with `express-oauth2-jwt-bearer` (issuer and audience verification) on the backend. Do not trust a client-side Auth0 user object as backend authorization.
