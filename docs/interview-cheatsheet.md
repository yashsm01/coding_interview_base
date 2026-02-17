# 🎯 Interview Cheatsheet - Alpha Dezine Full Stack

---

## 🔥 PART 1: SOLID Principles (With Examples From This Codebase)

### S — Single Responsibility
> One class → One responsibility

**In this project:**
- `ProductController` → handles HTTP only
- `ProductService` → handles business logic only
- `ProductRepository` → handles data access only

### O — Open/Closed
> Open for extension, closed for modification

**In this project:**
- `BaseRepository` provides generic CRUD
- `ProductRepository` extends it WITHOUT modifying base code
- New entities just create new repository class

### L — Liskov Substitution
> Child class must behave like parent

**In this project:**
- Any repository extending `BaseRepository` can be used wherever `BaseRepository` is expected

### I — Interface Segregation
> Don't force unused methods

**In this project:**
- `AuthService` doesn't implement product methods
- Each service has focused, specific methods

### D — Dependency Inversion
> Depend on abstractions, not concrete classes

**In this project:**
- Controllers depend on Service classes (not direct DB calls)
- Services depend on Repository classes (not raw SQL)

---

## 🔥 PART 2: .NET Core Theory (They Will Ask Even If You Choose Node)

### Middleware vs Filters
| Middleware | Filters |
|-----------|---------|
| Works at global request pipeline | Works inside MVC pipeline |
| Runs for ALL requests | Runs for specific actions |
| Example: Logging, Auth, CORS | Example: Validate ModelState, Cache |
| `app.UseMiddleware<T>()` | `[ServiceFilter(typeof(T))]` |

### EF Core Tracking
- **Tracked**: EF watches for changes, auto-updates on `SaveChanges()`
- **AsNoTracking()**: Read-only, faster, no change detection
- Use `AsNoTracking()` for GET/read endpoints

### DI in .NET Core
```csharp
// Transient: new instance every time
services.AddTransient<IProductService, ProductService>();
// Scoped: one per request
services.AddScoped<IProductRepository, ProductRepository>();
// Singleton: one for entire app
services.AddSingleton<ICacheService, CacheService>();
```

### Controller Lifecycle (.NET)
Request → Middleware Pipeline → Routing → Controller Created → Action Filter → Action → Result Filter → Response

---

## 🔥 PART 3: Node.js Deep Knowledge

### Event Loop (Critical Question)
```
┌─────────────────────────┐
│     Call Stack           │
│     (Synchronous)       │
├─────────────────────────┤
│     Microtask Queue     │  ← Promise.then, process.nextTick
├─────────────────────────┤
│     Macrotask Queue     │  ← setTimeout, setInterval, I/O
└─────────────────────────┘
```

### async/await vs Callbacks vs Promises
```javascript
// Callbacks (old, callback hell)
getUser(id, (err, user) => {
  getOrders(user.id, (err, orders) => { /* nested */ });
});

// Promises (better)
getUser(id).then(user => getOrders(user.id)).then(orders => {});

// async/await (best - clean, readable)
const user = await getUser(id);
const orders = await getOrders(user.id);
```

### Async Deadlock
When you `.then()` inside a synchronous context that blocks the event loop.
**Solution:** Always use `async/await` consistently, never mix `.then()` with blocking code.

---

## 🔥 PART 4: API Security Checklist

✅ JWT Authentication
✅ Role-based Authorization
✅ HTTPS (enforce in production)
✅ Rate Limiting (express-rate-limit)
✅ Helmet (security headers)
✅ CORS (restrict origins)
✅ Input Validation (express-validator)
✅ Parameterized Queries (prevent SQL injection)
✅ Store secrets in Environment Variables / Azure KeyVault
✅ Password hashing (bcrypt with salt rounds)

---

## 🔥 PART 5: Azure Concepts

### Service Principal
- Identity used by **applications** (not humans) to access Azure resources
- Used in: CI/CD pipelines, Automation, IaC
- Created via: `az ad sp create-for-rbac`

### CI/CD Pipeline (What to Say)
> "Push code → Azure DevOps triggers pipeline → Build stage → Run tests → Publish artifact → Deploy to Azure App Service using Service Principal"

### Infrastructure as Code (IaC)
- **ARM Templates**: Azure-native JSON
- **Bicep**: Simplified ARM syntax
- **Terraform**: Multi-cloud, HCL syntax
- Benefits: Repeatable, version-controlled, scalable

---

## 🔥 PART 6: SQL Optimization (Quick Reference)

| Technique | What It Does |
|-----------|-------------|
| Add indexes | Speeds up WHERE, JOIN, ORDER BY |
| Avoid SELECT * | Less I/O, use projection |
| Execution Plan | Identify table scans → add indexes |
| Pagination | OFFSET-FETCH, don't load all rows |
| Avoid subqueries | Use JOINs or CTEs instead |
| Stored Procedures | Pre-compiled, cached plans |
| Parameterized queries | Prevent SQL injection |
| Covering Index | INCLUDE columns to avoid key lookups |

---

## 🔥 PART 7: System Design - Real-time Sales Dashboard

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  Angular     │────▶│  Node.js API │────▶│  Azure SQL     │
│  Frontend    │     │  (.NET svc)  │     │  Database      │
└─────────────┘     └──────────────┘     └────────────────┘
      │                    │                      │
      │ WebSocket          │                      │
      │ (SignalR)          ▼                      │
      │             ┌──────────┐                  │
      └────────────▶│  Redis   │◀─────────────────┘
                    │  Cache   │
                    └──────────┘
                         │
                    ┌────────────┐
                    │ Azure      │
                    │ Service Bus│  (Message Queue for microservices)
                    └────────────┘
```

**Components:**
- Frontend: Angular (real-time updates via WebSocket/SignalR)
- Backend: Node.js / .NET Core microservices
- Database: Azure SQL
- Caching: Redis (frequently accessed data)
- Real-time: SignalR / WebSocket
- Message Queue: Azure Service Bus
- Auth: Azure AD / JWT
- Monitoring: Application Insights
- Deployment: Azure App Services + CI/CD

---

## ⚡ Rapid Fire Answers

| Question | Answer |
|----------|--------|
| **CORS** | Cross-Origin Resource Sharing — browser security that restricts cross-domain requests. Configure allowed origins in server. |
| **PUT vs PATCH** | PUT replaces entire resource. PATCH updates partial fields only. |
| **Task vs Thread** | Task is higher-level abstraction (uses thread pool). Thread is OS-level, expensive to create. |
| **REST Constraints** | Stateless, Client-Server, Cacheable, Uniform Interface, Layered System |
| **Microservice vs Monolith** | Monolith: single deployable. Microservice: independent services, own DB, communicate via API/message queue |
| **What is middleware?** | Code that runs between request and response. Forms a pipeline where each can modify req/res or pass to next. |

---

## 💪 Mock Interview Answers

### Q: "How would you build secure REST API using Node.js?"
> "I'd use Express with layered architecture — Controllers, Services, Repositories. For security: JWT for authentication, role-based middleware for authorization, Helmet for security headers, rate limiting, input validation with express-validator, CORS configuration, parameterized queries to prevent SQL injection, and bcrypt for password hashing. Secrets stored in environment variables, Azure KeyVault in production."

### Q: "How would you deploy full stack app in Azure?"
> "Backend deployed as Azure App Service (or containerized via AKS). Frontend as Azure Static Web App. Database on Azure SQL. CI/CD via Azure DevOps pipeline — triggered on push to main, builds both apps, runs tests, publishes artifacts, deploys using Service Principal. Secrets in KeyVault, monitoring via Application Insights."

### Q: "Optimize a slow SQL query returning 100k records?"
> "First, add server-side pagination (OFFSET-FETCH). Then check execution plan for table scans — add indexes on WHERE/JOIN/ORDER BY columns. Use projection (SELECT only needed columns, not *). Add covering indexes to avoid key lookups. For frequently accessed data, add Redis caching. Use AsNoTracking in ORM for read-only queries. Consider stored procedures for complex queries."

### Q: "Design scalable system for merchandise sales analytics?"
> "I'd use microservices architecture. Angular frontend with real-time dashboard via SignalR/WebSocket. Node.js API gateway. Separate services for Products, Orders, Analytics. Azure SQL for transactional data, Redis for caching hot data. Azure Service Bus for async communication between services. Application Insights for monitoring. Deploy via Azure DevOps CI/CD to App Services."
