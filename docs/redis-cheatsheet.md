# 🔴 Redis Cheatsheet — Manual Verification

Learn how to inspect the Redis cache manually using Docker.

---

## 1. Connect to Redis Container
Access the Redis CLI inside the running container:
```bash
docker exec -it merch-redis redis-cli
```

---

## 2. Common Commands

| Command | Description | Example |
|---------|-------------|---------|
| `PING` | Check connection | `PING` → `PONG` |
| `KEYS *` | List all keys | `KEYS *` |
| `GET <key>` | Get value of a key | `GET cache:/api/products` |
| `TTL <key>` | Check time-to-live (seconds) | `TTL cache:/api/products` |
| `DEL <key>` | Delete a key | `DEL cache:/api/products` |
| `FLUSHALL` | Clear entire cache | `FLUSHALL` |

---

## 3. Application Cache Keys

The application uses the prefix `cache:` followed by the API endpoint path.

### 📦 Product List (Duration: 5 mins)
```bash
GET "cache:/api/products"
```

### 🎓 Top Universities (Duration: 1 hour)
```bash
GET "cache:/api/orders/top-universities"
```

### 📂 Categories (Duration: 1 hour)
```bash
GET "cache:/api/products/categories"
```

### 👤 User Session (Duration: 3 hours)
```bash
# Replace with actual user ID
GET "user:550e8400-e29b-41d4-a716-446655440000"
```

---

## 4. Troubleshooting

**Q: Cache key not found?**
> The cache uses the **Cache-Aside** pattern. Data is only cached *after* the first request.
> 1. Hit the endpoint first: `http://localhost:5000/api/products`
> 2. Then check Redis: `KEYS *`

**Q: How to force refresh?**
> You can manually delete the key to force the application to fetch fresh data from the DB:
> ```bash
> DEL "cache:/api/products"
> ```
