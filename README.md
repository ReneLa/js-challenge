# User Management System

A fullstack user management app with Next.js frontend and Express backend. Features protobuf-based data verification and export.

## Quick Start

**Requirements:** Docker & Docker Compose

```bash
# Build and run
docker-compose up --build

# Or run in background
docker-compose up -d
```

**Access:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/docs

- SSH : ssh -i "was-key.pem" ec2-user@ec2-56-228-18-25.eu-north-1.compute.amazonaws.com

## Local Development

Want to run without Docker? Check out:

- [Backend Setup](./backend/README.md) - Express + Prisma + SQLite
- [Frontend Setup](./frontend/README.md) - Next.js 15 + React 19

## Docker Commands

```bash
# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Fresh start (rebuild from scratch)
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Troubleshooting

**Port conflicts?** Edit port mappings in `docker-compose.yml`

**Reset database:**

```bash
docker-compose down
rm backend/prisma/dev.db
docker-compose up --build
```

## Stack

- **Backend:** Express, TypeScript, Prisma, SQLite
- **Frontend:** Next.js 15, React 19, TailwindCSS, React Query
- **Features:** REST API, Protobuf export, RSA signature verification


## How Data Verification Works

1. Backend generates RSA keypair on startup
2. User emails are hashed (SHA384) and signed (RSA-SHA384)
3. Export endpoint (`/users/export`) returns protobuf-encoded data
4. Frontend can verify signatures using public key from `/users/publicKey`