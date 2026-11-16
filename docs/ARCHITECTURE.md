# Architecture

## Overview

A monorepo with two npm workspaces:

- `client/`: React + Vite + Tailwind single-page app. In production it is built to `client/dist`.
- `server/`: Express 5 API using Mongoose and MongoDB. It also serves the built client.

```
Browser (React SPA)
   |  axios (client/src/api/axios.js)
   v
Express app (server/app.js)
   |-- /api/auth          register/login, access + refresh tokens
   |-- /api/companies     MSME listings
   |-- /api/invest        investments, recommendations
   |-- /api/documents     document vault, download with access check
   |-- /api/verification  KYC uploads (PAN, Udyam)
   |-- /api/health        DB connection probe
   |-- /api-docs          Swagger UI
   v
MongoDB (models: User, Company, Investment, Document, AuditLog)
```

## Request flow

`server/app.js` applies, in order: JSON body parsing (1 MB limit), cookie parsing, CORS restricted to `CLIENT_ORIGIN`, a request logger, then the routers. Unknown `/api/*` paths return a JSON 404. Everything else falls through to the static client build and the SPA catch-all. A global error handler turns errors into JSON. It hides messages for 5xx errors and file-system paths.

## Key modules

- `server/utils/creditScore.js`: trust score from revenue, debt and years in business.
- `server/utils/matchmaker.js`: TF-IDF matching between an investor's stated preferences and listings.
- `server/workers/reportWorker.js` and `server/services/queueService.js`: background investment-receipt jobs on a worker thread.
- `server/middleware/`: authentication, role checks and Joi validation.

## Security model

- Access tokens are short-lived (15 min). A refresh token is kept in an HTTP-only cookie.
- Roles (`msme`, `investor`) are read from the database on every request, not trusted from the token.
- Uploaded files are never served statically. They are returned only by the download route after an owner/shared-with check, and accesses are written to the audit log.

## Testing

`cd server && JWT_SECRET=test npm test` runs `node --test` over `server/test/`. The current tests are smoke tests of the app that need no database. Controller and model tests would need a MongoDB test instance and are not yet written.

## Known limitations

- No payment processing: an investment is a record only.
- `DEMO_AUTO_VERIFY` simulates KYC verification and is for demos only.
- `GET /api/companies` seeds demo data when the collection is empty.
- The request logger uses `console.log`. The Winston logger in `server/config/logger.js` is not wired into `app.js`.
