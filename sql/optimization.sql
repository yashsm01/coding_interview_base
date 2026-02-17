-- ═══════════════════════════════════════════════════
-- SQL Optimization Techniques
-- INTERVIEW REFERENCE: "How to optimize slow SQL query?"
-- ═══════════════════════════════════════════════════

-- ❌ BAD: Returns all columns, no pagination
-- SELECT * FROM Products;

-- ✅ GOOD: Projection + Pagination
SELECT id, name, category, price, stock
FROM Products
WHERE isActive = 1
ORDER BY createdAt DESC
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 1: Avoid SELECT * (use projection)
-- Only select columns you need → less I/O, less memory
-- ═══════════════════════════════════════════════════
SELECT p.id, p.name, p.price, u.name AS universityName
FROM Products p
INNER JOIN Universities u ON p.universityId = u.id
WHERE p.isActive = 1;

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 2: Pagination with OFFSET-FETCH
-- INTERVIEW ANSWER: "API returning 50k records → add server-side pagination"
-- ═══════════════════════════════════════════════════
DECLARE @Page INT = 1, @PageSize INT = 10;

SELECT id, name, category, price
FROM Products
WHERE isActive = 1
ORDER BY createdAt DESC
OFFSET (@Page - 1) * @PageSize ROWS
FETCH NEXT @PageSize ROWS ONLY;

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 3: Use Execution Plan
-- In SSMS: Ctrl+L to view estimated plan
-- Look for: Table Scans (bad) → should be Index Seeks (good)
-- ═══════════════════════════════════════════════════
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT * FROM Products WHERE category = 'Apparel';
-- Check: Logical reads should be minimal with proper index

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 4: Parameterized Queries (prevent SQL injection)
-- In code: NEVER concatenate user input into SQL
-- ═══════════════════════════════════════════════════
-- ❌ BAD: 'SELECT * FROM Products WHERE name = ''' + @userInput + ''''
-- ✅ GOOD: Use parameters
DECLARE @SearchName NVARCHAR(200) = 'Hoodie';
SELECT * FROM Products WHERE name LIKE '%' + @SearchName + '%';

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 5: Covering Index (avoids key lookup)
-- Include frequently selected columns in the index
-- ═══════════════════════════════════════════════════
-- Already created in schema.sql:
-- CREATE INDEX IX_Products_IsActive ON Products(isActive) INCLUDE (name, price, category);

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 6: Avoid subqueries → use JOINs or CTEs
-- ═══════════════════════════════════════════════════
-- ❌ BAD: Correlated subquery
-- SELECT * FROM Products WHERE universityId IN (SELECT id FROM Universities WHERE location LIKE '%CA%');

-- ✅ GOOD: JOIN
SELECT p.*
FROM Products p
INNER JOIN Universities u ON p.universityId = u.id
WHERE u.location LIKE '%CA%';

-- ═══════════════════════════════════════════════════
-- TECHNIQUE 7: Use Stored Procedures for complex queries
-- Benefits: Pre-compiled, cached execution plan, security
-- ═══════════════════════════════════════════════════
CREATE OR ALTER PROCEDURE GetProductsPaginated
    @Page     INT = 1,
    @PageSize INT = 10,
    @Category NVARCHAR(100) = NULL,
    @Search   NVARCHAR(200) = NULL,
    @SortBy   NVARCHAR(50) = 'createdAt',
    @SortOrder NVARCHAR(4) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.id, p.name, p.category, p.price, p.stock,
        u.name AS universityName,
        COUNT(*) OVER() AS totalCount
    FROM Products p
    INNER JOIN Universities u ON p.universityId = u.id
    WHERE p.isActive = 1
      AND (@Category IS NULL OR p.category = @Category)
      AND (@Search IS NULL OR p.name LIKE '%' + @Search + '%')
    ORDER BY
        CASE WHEN @SortBy = 'name' AND @SortOrder = 'ASC' THEN p.name END ASC,
        CASE WHEN @SortBy = 'name' AND @SortOrder = 'DESC' THEN p.name END DESC,
        CASE WHEN @SortBy = 'price' AND @SortOrder = 'ASC' THEN p.price END ASC,
        CASE WHEN @SortBy = 'price' AND @SortOrder = 'DESC' THEN p.price END DESC,
        p.createdAt DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO
