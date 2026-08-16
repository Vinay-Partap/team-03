# Deploy GovIntel: Vercel + Render + MongoDB Atlas

## 1. MongoDB Atlas

Create an Atlas cluster and database user. In Network Access, allow Render access (for a demo, `0.0.0.0/0`; restrict this for production). Copy the SRV connection string into Render as `MONGODB_URI`.

## 2. Render API

Create a Render **Blueprint** from this repository, or create a Web Service manually:

- Root directory: `backend`
- Build command: `npm ci --omit=dev`
- Start command: `node src/server.js`
- Health check: `/api/health`

Set secret/config variables in Render:

```text
NODE_ENV=production
MONGODB_URI=<Atlas connection string>
JWT_SECRET=<long random secret>
JWT_REFRESH_SECRET=<different long random secret>
CLIENT_ORIGIN=https://<your-vercel-project>.vercel.app
FRONTEND_URL=https://<your-vercel-project>.vercel.app
GOOGLE_CLIENT_ID=<Google OAuth client id>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
GOOGLE_CALLBACK_URL=https://<your-render-api>.onrender.com/api/auth/google/callback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<SMTP account>
SMTP_PASS=<Gmail App Password>
SMTP_FROM=<sender address>
```

After deployment, copy the Render URL, e.g. `https://govintel-api.onrender.com`.

## 3. Vercel frontend

Import this GitHub repository into Vercel. Configure:

- Framework: Vite
- Build command: `npm --prefix frontend ci && npm --prefix frontend run build`
- Output directory: `frontend/dist`

Set Vercel environment variable:

```text
VITE_API_URL=https://<your-render-api>.onrender.com/api
```

Redeploy after setting it.

## 4. OAuth and CORS updates

After you have both public URLs, update Render `CLIENT_ORIGIN` and `FRONTEND_URL`, then update Google Cloud OAuth:

```text
Authorized JavaScript origins:
https://<your-vercel-project>.vercel.app

Authorized redirect URIs:
https://<your-render-api>.onrender.com/api/auth/google/callback
```

Restart/redeploy Render after changing backend variables.

## 5. Post-deploy checks

```text
GET https://<render-api>/api/health
Open https://<vercel-app>
Register/login
Google OAuth callback
SMTP verification/reset
Policy/Scheme document upload
```

Note: Render's ephemeral filesystem is unsuitable for durable uploaded documents. Use S3-compatible storage before relying on production document uploads.
