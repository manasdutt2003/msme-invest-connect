# MSME Invest Connect

A platform connecting MSMEs with investors.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running locally, or a cloud connection string)

## Project Structure

- `client`: React frontend (Vite)
- `server`: Express backend

## Getting Started

### 1. Backend (Server)

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` directory (optional, uses defaults if missing):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/msme_invest
```

Start the server:

```bash
npm start
# OR for development with auto-restart
npm run dev
```

The server should be running at `http://localhost:5000`.

### 2. Frontend (Client)

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The client should be available at `http://localhost:5173` (or the port shown in terminal).

## Troubleshooting

- **MongoDB Connection Error**: Ensure your MongoDB service is running. simpler option is to use a cloud database like MongoDB Atlas.
- **Port Conflicts**: If port 5000 or 5173 are in use, modify the `.env` or Vite config respectively.
