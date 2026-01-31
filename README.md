# MSME Invest Connect

A modern, full-stack platform connecting MSMEs (Micro, Small, and Medium Enterprises) with investors. Secure, scalable, and built with industry standards.

## 🚀 Features

- **User Authentication**: Secure JWT-based auth with Role-Based Access Control (RBAC) for MSMEs and Investors.
- **Investment Marketplace**: Real-time listing of businesses seeking funding.
- **Dashboard**: Tailored views for Investors (Portfolio) and MSMEs (Company Management).
- **Modern UI**: Responsive, beautiful interface built with React and Tailwind CSS.
- **API Documentation**: Interactive API testing with Swagger UI.
- **Validation**: Robust input validation using Joi.
- **Dockerized**: specific `Dockerfile`s and `docker-compose` for easy deployment.

## 🛠️ Tech Stack

### Client
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: React Hooks
- **Routing**: React Router DOM

### Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Joi
- **Documentation**: Swagger UI

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## 📦 Getting Started

### Prerequisites
- Docker & Docker Compose (Recommended)
- Node.js v18+ (if running locally without Docker)
- MongoDB (if running locally)

### Quick Start (Docker)

The easiest way to run the application is using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

### Manual Setup

#### 1. Backend (Server)

```bash
cd server
npm install
npm start
```
_Ensure MongoDB is running locally or provide `MONGODB_URI` in `.env`._

#### 2. Frontend (Client)

```bash
cd client
npm install
npm run dev
```

## 📖 API Documentation

Once the server is running, visit `http://localhost:5000/api-docs` to access the full Swagger documentation.

## 🧱 Project Structure

- `client/`: React frontend application.
- `server/`: Express backend API.
  - `controllers/`: Business logic.
  - `routes/`: API route definitions.
  - `models/`: Mongoose database schemas.
  - `middleware/`: Auth and validation middleware.
  - `docs/`: Swagger configuration.
- `docker-compose.yml`: Container orchestration.
