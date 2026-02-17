# 🐳 Docker Setup — Step by Step

> Run the entire stack (Node.js API + PostgreSQL) in Docker containers.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- No need to install Node.js, PostgreSQL, or any dependencies locally

---

## Option 1: Docker Compose (Recommended — One Command)

### Step 1: Navigate to project root
```bash
cd d:\projects\interview\coding_interview_base
```

### Step 2: Build and start everything
```bash
docker-compose up --build
```

### Step 3: Verify
- **API:** http://localhost:5000/api/health
- **Swagger:** http://localhost:5000/api-docs
- **PostgreSQL:** localhost:5432

### Step 4: Stop containers
```bash
docker-compose down
```

### Step 5: Stop and delete database volume (clean reset)
```bash
docker-compose down -v
```

---

## Option 2: Docker Only (Manual — Step by Step)

### Step 1: Create a Docker network
```bash
docker network create merch-network
```

### Step 2: Start PostgreSQL container
```bash
docker run -d ^
  --name merch-db ^
  --network merch-network ^
  -e POSTGRES_DB=universitymerchdb ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=1234 ^
  -p 5432:5432 ^
  postgres:16-alpine
```

### Step 3: Build the API image
```bash
cd backend
docker build -t merch-api .
```

### Step 4: Run the API container
```bash
docker run -d ^
  --name merch-api ^
  --network merch-network ^
  -p 5000:5000 ^
  -e PORT=5000 ^
  -e NODE_ENV=production ^
  -e DB_HOST=merch-db ^
  -e DB_PORT=5432 ^
  -e DB_NAME=universitymerchdb ^
  -e DB_USER=postgres ^
  -e DB_PASSWORD=1234 ^
  -e DB_DIALECT=postgres ^
  -e JWT_SECRET=change-this-in-production ^
  -e JWT_REFRESH_SECRET=change-this-refresh-in-production ^
  merch-api
```

### Step 5: Verify
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"healthy","timestamp":"...","uptime":...}`

### Step 6: Check logs
```bash
docker logs merch-api
docker logs merch-db
```

### Step 7: Stop and remove containers
```bash
docker stop merch-api merch-db
docker rm merch-api merch-db
docker network rm merch-network
```

---

## Useful Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Build & start all services |
| `docker-compose up -d` | Start in background (detached) |
| `docker-compose down` | Stop all services |
| `docker-compose down -v` | Stop + delete volumes (reset DB) |
| `docker-compose logs -f api` | Follow API logs |
| `docker-compose logs -f db` | Follow DB logs |
| `docker ps` | List running containers |
| `docker exec -it merch-db psql -U postgres` | Open PostgreSQL shell |
| `docker exec -it merch-redis redis-cli` | Open Redis shell (See [Redis Cheatsheet](redis-cheatsheet.md)) |
| `docker exec -it merch-api sh` | Shell into API container |

---

## Docker Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Compose                 │
│                                             │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │  merch-api   │─────▶│    merch-db     │  │
│  │  (Node.js)   │      │  (PostgreSQL)   │  │
│  │  Port: 5000  │      │  Port: 5432     │  │
│  └─────────────┘      └─────────────────┘  │
│        │                       │            │
└────────┼───────────────────────┼────────────┘
         │                       │
    localhost:5000          localhost:5432
    (API + Swagger)        (Database)
```

---

## Interview Talking Points

**Q: "Explain your Dockerfile"**
> "I use a multi-stage build. Stage 1 installs dependencies with `npm ci --only=production` for deterministic builds. Stage 2 copies only the production node_modules, runs as a non-root user for security, and includes a health check endpoint. This keeps the image small and secure."

**Q: "Why Docker Compose?"**
> "Docker Compose orchestrates multiple services — the API and PostgreSQL start together, with the API depending on the database health check. Environment variables configure the connection. One command to start the entire stack."

**Q: "How do you handle secrets in Docker?"**
> "In development, environment variables in docker-compose.yml. In production, I'd use Azure KeyVault, Docker secrets, or Kubernetes secrets — never hardcode secrets in the image."
