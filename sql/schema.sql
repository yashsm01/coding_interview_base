-- ═══════════════════════════════════════════════════
-- University Merchandise Database Schema
-- SQL Server - Interview Ready
-- ═══════════════════════════════════════════════════

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'UniversityMerchDB')
    CREATE DATABASE UniversityMerchDB;
GO

USE UniversityMerchDB;
GO

-- ─── USERS TABLE ───
CREATE TABLE Users (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username        NVARCHAR(50)     NOT NULL UNIQUE,
    email           NVARCHAR(100)    NOT NULL UNIQUE,
    password        NVARCHAR(255)    NOT NULL,
    role            NVARCHAR(20)     DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    isActive        BIT              DEFAULT 1,
    createdAt       DATETIME2        DEFAULT GETUTCDATE(),
    updatedAt       DATETIME2        DEFAULT GETUTCDATE(),
    deletedAt       DATETIME2        NULL
);

-- ─── UNIVERSITIES TABLE ───
CREATE TABLE Universities (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name            NVARCHAR(200)    NOT NULL UNIQUE,
    location        NVARCHAR(200)    NULL,
    contactEmail    NVARCHAR(100)    NULL,
    isActive        BIT              DEFAULT 1,
    createdAt       DATETIME2        DEFAULT GETUTCDATE(),
    updatedAt       DATETIME2        DEFAULT GETUTCDATE()
);

-- ─── PRODUCTS TABLE ───
CREATE TABLE Products (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name            NVARCHAR(200)    NOT NULL,
    description     NVARCHAR(MAX)    NULL,
    category        NVARCHAR(100)    NOT NULL,
    price           DECIMAL(10,2)    NOT NULL CHECK (price >= 0),
    stock           INT              DEFAULT 0 CHECK (stock >= 0),
    imageUrl        NVARCHAR(500)    NULL,
    isActive        BIT              DEFAULT 1,
    universityId    UNIQUEIDENTIFIER NOT NULL,
    createdAt       DATETIME2        DEFAULT GETUTCDATE(),
    updatedAt       DATETIME2        DEFAULT GETUTCDATE(),
    deletedAt       DATETIME2        NULL,
    CONSTRAINT FK_Product_University FOREIGN KEY (universityId) REFERENCES Universities(id)
);

-- ─── ORDERS TABLE ───
CREATE TABLE Orders (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    productId       UNIQUEIDENTIFIER NOT NULL,
    universityId    UNIQUEIDENTIFIER NOT NULL,
    quantity        INT              NOT NULL CHECK (quantity > 0),
    amount          DECIMAL(12,2)    NOT NULL CHECK (amount >= 0),
    status          NVARCHAR(20)     DEFAULT 'pending' 
                    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    orderDate       DATETIME2        DEFAULT GETUTCDATE(),
    createdAt       DATETIME2        DEFAULT GETUTCDATE(),
    updatedAt       DATETIME2        DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Order_Product    FOREIGN KEY (productId) REFERENCES Products(id),
    CONSTRAINT FK_Order_University FOREIGN KEY (universityId) REFERENCES Universities(id)
);

-- ═══════════════════════════════════════════════════
-- INDEXES (Performance Optimization)
-- INTERVIEW POINT: "How to optimize slow SQL query?"
-- Answer: Add proper indexes on columns used in WHERE, JOIN, ORDER BY
-- ═══════════════════════════════════════════════════

-- Products: Filter/sort indexes
CREATE NONCLUSTERED INDEX IX_Products_Category     ON Products(category);
CREATE NONCLUSTERED INDEX IX_Products_UniversityId ON Products(universityId);
CREATE NONCLUSTERED INDEX IX_Products_Price        ON Products(price);
CREATE NONCLUSTERED INDEX IX_Products_Name         ON Products(name);
CREATE NONCLUSTERED INDEX IX_Products_IsActive     ON Products(isActive) INCLUDE (name, price, category);

-- Orders: For aggregation queries
CREATE NONCLUSTERED INDEX IX_Orders_UniversityId   ON Orders(universityId);
CREATE NONCLUSTERED INDEX IX_Orders_ProductId      ON Orders(productId);
CREATE NONCLUSTERED INDEX IX_Orders_OrderDate      ON Orders(orderDate);
CREATE NONCLUSTERED INDEX IX_Orders_Status         ON Orders(status);

-- Covering index for Top Universities query
CREATE NONCLUSTERED INDEX IX_Orders_TopUniversity 
    ON Orders(universityId) INCLUDE (amount);

-- Users
CREATE NONCLUSTERED INDEX IX_Users_Email           ON Users(email);

-- ═══════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════

-- Universities
INSERT INTO Universities (id, name, location, contactEmail) VALUES
(NEWID(), 'MIT', 'Cambridge, MA', 'merch@mit.edu'),
(NEWID(), 'Stanford University', 'Stanford, CA', 'store@stanford.edu'),
(NEWID(), 'Harvard University', 'Cambridge, MA', 'shop@harvard.edu'),
(NEWID(), 'Yale University', 'New Haven, CT', 'store@yale.edu'),
(NEWID(), 'Princeton University', 'Princeton, NJ', 'shop@princeton.edu'),
(NEWID(), 'Columbia University', 'New York, NY', 'merch@columbia.edu'),
(NEWID(), 'University of Oxford', 'Oxford, UK', 'shop@ox.ac.uk'),
(NEWID(), 'Caltech', 'Pasadena, CA', 'store@caltech.edu');
GO

PRINT '✅ Schema created, indexes applied, seed data inserted.';
GO
