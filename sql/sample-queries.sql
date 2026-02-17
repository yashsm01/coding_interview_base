-- ═══════════════════════════════════════════════════
-- Sample Interview Queries
-- Ready to copy-paste during coding round
-- ═══════════════════════════════════════════════════

-- ─── Q1: Top 5 Universities with Highest Sales ───
-- INTERVIEW QUESTION: "Write query to find top 5 universities with highest sales"
SELECT TOP 5 
    o.universityId,
    u.name AS universityName,
    SUM(o.amount) AS totalSales,
    COUNT(o.id) AS orderCount
FROM Orders o
INNER JOIN Universities u ON o.universityId = u.id
GROUP BY o.universityId, u.name
ORDER BY totalSales DESC;

-- ─── Q2: Products with no orders (LEFT JOIN) ───
SELECT p.id, p.name, p.price
FROM Products p
LEFT JOIN Orders o ON p.id = o.productId
WHERE o.id IS NULL AND p.isActive = 1;

-- ─── Q3: Monthly sales trend ───
SELECT 
    YEAR(orderDate) AS year,
    MONTH(orderDate) AS month,
    COUNT(*) AS orderCount,
    SUM(amount) AS totalSales,
    AVG(amount) AS avgOrderValue
FROM Orders
WHERE status != 'cancelled'
GROUP BY YEAR(orderDate), MONTH(orderDate)
ORDER BY year DESC, month DESC;

-- ─── Q4: Products with stock below threshold ───
SELECT p.name, p.category, p.stock, p.price, u.name AS university
FROM Products p
INNER JOIN Universities u ON p.universityId = u.id
WHERE p.stock < 10 AND p.isActive = 1
ORDER BY p.stock ASC;

-- ─── Q5: University-wise category breakdown ───
SELECT 
    u.name AS university,
    p.category,
    COUNT(p.id) AS productCount,
    AVG(p.price) AS avgPrice
FROM Products p
INNER JOIN Universities u ON p.universityId = u.id
WHERE p.isActive = 1
GROUP BY u.name, p.category
ORDER BY u.name, productCount DESC;

-- ─── Q6: Running total of sales (Window Function) ───
SELECT 
    orderDate,
    amount,
    SUM(amount) OVER (ORDER BY orderDate) AS runningTotal
FROM Orders
WHERE status != 'cancelled'
ORDER BY orderDate;

-- ─── Q7: Dense Rank universities by revenue ───
SELECT 
    u.name,
    SUM(o.amount) AS totalRevenue,
    DENSE_RANK() OVER (ORDER BY SUM(o.amount) DESC) AS revenueRank
FROM Orders o
INNER JOIN Universities u ON o.universityId = u.id
GROUP BY u.name;
