# LearnMate AI deployment guide

This guide deploys the existing React/Vite frontend and Node/Express backend without changing application behavior.

## Deployment platforms

- Frontend: Vercel static deployment from `client/`
- Backend: Render Web Service from `server/`
- Source: public GitHub repository containing the `main` branch

Deployment is not live until the public URLs are opened and verified.

## Frontend: Vercel

Create a Vercel project connected to the GitHub repository with:

- **Root Directory:** `client`
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Set this build environment variable:

```text
VITE_API_BASE_URL=https://<verified-render-backend-url>
```

`client/vercel.json` rewrites nested application routes to `index.html`, so direct navigation and refresh work for `/dashboard`, `/learn`, `/practice`, `/revision`, `/analytics`, and `/assistant`.

## Backend: Render

Create a Render Web Service connected to the same repository with:

- **Root Directory:** `server`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

Set these environment variables:

```text
PORT=10000
CLIENT_URL=https://<verified-vercel-frontend-url>
AI_API_KEY=<optional-server-side-provider-key>
AI_API_URL=<optional-openai-compatible-endpoint>
AI_MODEL=gpt-4o-mini
```

`PORT` is supplied by the hosting platform when required. Keep `AI_API_KEY` server-side; never add it to Vercel variables or frontend source. If no AI provider variables are configured, the labelled deterministic fallback remains available.

## CORS and health check

The Express app allows the exact `CLIENT_URL` origin in production and does not use unrestricted `origin: "*"`. Development localhost origins remain available only outside production.

After deploying the backend, verify:

```text
GET https://<verified-render-backend-url>/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "learnmate-api"
}
```

## Deployment order

1. Create or connect the public GitHub repository.
2. Deploy the Render backend.
3. Open and verify the backend health URL.
4. Deploy the Vercel frontend with `VITE_API_BASE_URL` set to the verified backend URL.
5. Open and verify the frontend URL.
6. Update Render `CLIENT_URL` to the verified frontend URL and redeploy the backend if it changed.
7. Test the complete learning flow from the public frontend.

## Production testing

Check the frontend landing page and refresh each route:

- `/dashboard`
- `/learn`
- `/practice`
- `/revision`
- `/analytics`
- `/assistant`

Then verify frontend-to-backend explanation, quiz generation, answer submission, no-repeat history, results, recommendations, revision, analytics, and assistant behavior. If no provider key is configured, confirm the fallback content is visibly labelled.

## Troubleshooting

- **CORS errors:** Set Render `CLIENT_URL` to the exact Vercel origin, without a trailing path.
- **API requests target localhost:** Rebuild Vercel after setting `VITE_API_BASE_URL`; Vite variables are embedded at build time.
- **Nested route refresh returns 404:** Confirm the Vercel project root is `client` and `client/vercel.json` is deployed.
- **Backend fails to start:** Confirm Render uses `npm run build` and `npm start` from the `server` root.
- **Health check fails:** Inspect Render logs and confirm the service is listening on the platform-provided `PORT`.
- **AI fallback appears:** Configure the optional server-side AI variables only if live provider behavior is desired; do not expose the key to the browser.

## Verified URLs

Do not record placeholder URLs as verified. Update [verified-urls.md](./verified-urls.md) only after opening the actual public frontend, backend health endpoint, and GitHub repository.
