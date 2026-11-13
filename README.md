# MSME Invest Connect

A marketplace connecting small manufacturing businesses (MSMEs) that need working capital with investors. MSMEs list a funding request; investors browse, get ranked recommendations, invest, and track a portfolio.

## Features

- **Two roles**: `msme` (list a company, upload KYC and vault documents) and `investor` (browse, invest, share-gated document access)
- **Trust score** from revenue, debt and years in business (`server/utils/creditScore.js`)
- **Recommendations**: TF-IDF match between an investor's stated preferences and each listing (`server/utils/matchmaker.js`)
- **Document vault** with per-investor sharing and an audit log of every access
- **KYC uploads** for PAN and Udyam documents
- **Background jobs** on a worker thread for investment receipts
- **API docs** at `/api-docs` (Swagger)
- Short-lived access tokens (15 min) plus an HTTP-only refresh cookie

## Stack

React 18 + Vite + Tailwind (client), Node.js + Express 5 + Mongoose (server), MongoDB.

## Run locally

```bash
npm install
cp server/.env.example server/.env     # set JWT_SECRET
npm run dev --prefix server            # API on :5000
npm run dev --prefix client            # app on :5173
```

Or with Docker (needs a `.env` beside `docker-compose.yml` containing `JWT_SECRET`):

```bash
docker compose up --build
```

## Configuration (`server/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | yes | Signs tokens. The server refuses to start without it |
| `MONGODB_URI` | no | Defaults to a local MongoDB |
| `CLIENT_ORIGIN` | no | Comma-separated origins allowed by CORS (default `http://localhost:5173`) |
| `DEMO_AUTO_VERIFY` | no | `true` marks KYC uploads verified after 5 s. Demo only; real verification needs a KYC provider |

## Security notes

- Uploaded files are private: they are served only by `/api/documents/:id/download` after an owner/shared-with check, never as static files.
- Roles are read from the database on every request.

## Known limitations

- `GET /api/companies` seeds three demo companies when the collection is empty.
- No payment processing: an investment is a record, not a money transfer.
- The scheduled workflows in `.github/workflows` write simulated reports; they do not lint or test the code.
