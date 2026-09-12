# Verified URLs

## Frontend

**Status:** NOT DEPLOYED  
**Verified URL:** None

The frontend was verified locally at `http://localhost:5173`, but no public deployment URL is available.

## Backend

**Status:** NOT DEPLOYED  
**Verified URL:** None

The compiled backend was verified locally at `http://localhost:4000`. On 2026-09-12, `GET /api/health` returned:

```json
{
  "status": "ok",
  "service": "learnmate-api"
}
```

## GitHub

**Status:** NOT CONFIGURED  
**Verified URL:** None

The local repository exists on branch `main`, but no GitHub remote URL is configured.

## Deployment requirements

Before publishing:

1. Deploy `server/` as a Node service using `npm run build` and `npm start`.
2. Set backend `PORT` and `CLIENT_URL`.
3. Set optional server-side AI variables: `AI_API_KEY`, `AI_API_URL`, and `AI_MODEL`.
4. Deploy `client/` as a Vite static site using `npm run build`.
5. Set frontend build variable `VITE_API_BASE_URL` to the verified backend URL.
6. Configure SPA fallback to serve `client/dist/index.html` for nested routes.
7. Replace the unverified fields in this document only after testing the public URLs.

## Verification record

**Last local verification:** 2026-09-12  
**Public URLs verified:** None  
**Public deployment status:** Not deployed
