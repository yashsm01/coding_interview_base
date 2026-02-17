# Backend - University Merchandise API

## Quick Start
```bash
npm install
cp .env.example .env    # Edit with your SQL Server credentials
npm run dev             # Start with nodemon
```

## Architecture (SOLID Principles)
```
Controller → Service → Repository → Database
     ↓           ↓           ↓
  HTTP only   Business    Data Access
              Logic       (Sequelize)
     ↓
   Redis
(Caching)
```

## Quick Start (Docker - Recommended)
```bash
docker-compose up --build
```

## Quick Start (Local)
```bash
# 1. Start Redis & SQL Server/Postgres
# 2. Configure .env
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint                        | Auth    | Description              |
|--------|---------------------------------|---------|--------------------------|
| POST   | /api/auth/register              | ❌      | Register user            |
| POST   | /api/auth/login                 | ❌      | Login → JWT token        |
| POST   | /api/auth/refresh               | ❌      | Refresh token            |
| GET    | /api/auth/profile               | 🔒      | Current user profile     |
| GET    | /api/products                   | ❌      | Paginated + search       |
| GET    | /api/products/:id               | ❌      | Get by ID                |
| POST   | /api/products                   | 🔒      | Create product           |
| PUT    | /api/products/:id               | 🔒      | Update product           |
| DELETE | /api/products/:id               | 🔒Admin | Delete product           |
| GET    | /api/orders/top-universities    | ❌      | Top 5 by sales           |

## Swagger Docs
Visit: http://localhost:5000/api-docs
