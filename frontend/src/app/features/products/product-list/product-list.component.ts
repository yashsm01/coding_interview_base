/**
 * Product List Component
 * 
 * INTERVIEW POINT: Demonstrates:
 * - Data binding (property + event binding)
 * - HTTP service calls using RxJS Observables
 * - Search, filter, sort, pagination
 * - Component lifecycle (ngOnInit)
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, ProductQueryParams } from '../../../core/services/product.service';
import { Product, PaginatedResponse } from '../../../models/interfaces';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="products-container">
      <!-- Search & Filter Bar -->
      <div class="toolbar">
        <div class="search-box">
          <input
            type="text"
            placeholder="🔍 Search products..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
          >
        </div>
        <div class="filters">
          <select [(ngModel)]="selectedCategory" (change)="loadProducts()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
          <select [(ngModel)]="sortBy" (change)="loadProducts()">
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
          <select [(ngModel)]="sortOrder" (change)="loadProducts()">
            <option value="ASC">↑ Ascending</option>
            <option value="DESC">↓ Descending</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">Loading products...</div>

      <!-- Product Grid -->
      <div class="product-grid" *ngIf="!loading">
        <div class="product-card" *ngFor="let product of products" (click)="viewProduct(product)">
          <div class="product-image">📦</div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <span class="category-badge">{{ product.category }}</span>
            <p class="price">\${{ product.price }}</p>
            <p class="stock" [class.low-stock]="product.stock < 10">
              Stock: {{ product.stock }}
            </p>
            <p class="university" *ngIf="product.university">
              🎓 {{ product.university.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty" *ngIf="!loading && products.length === 0">
        No products found. Try a different search.
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="pagination">
        <button
          (click)="changePage(pagination.currentPage - 1)"
          [disabled]="!pagination.hasPrev"
          class="btn-page"
        >← Previous</button>

        <span class="page-info">
          Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
          ({{ pagination.totalItems }} items)
        </span>

        <button
          (click)="changePage(pagination.currentPage + 1)"
          [disabled]="!pagination.hasNext"
          class="btn-page"
        >Next →</button>
      </div>
    </div>
  `,
    styles: [`
    .products-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 12px;
      margin-bottom: 24px; align-items: center;
    }
    .search-box input {
      padding: 10px 16px; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; background: rgba(255,255,255,0.05);
      color: #fff; font-size: 1rem; width: 300px; outline: none;
    }
    .search-box input:focus { border-color: #7c3aed; }
    .filters { display: flex; gap: 8px; }
    select {
      padding: 10px 12px; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; background: rgba(30,30,50,0.9);
      color: #fff; font-size: 0.9rem; cursor: pointer;
    }
    .product-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }
    .product-card {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px; padding: 20px; cursor: pointer;
      transition: transform 0.2s, border-color 0.2s;
    }
    .product-card:hover { transform: translateY(-4px); border-color: #7c3aed; }
    .product-image { font-size: 3rem; text-align: center; margin-bottom: 12px; }
    h3 { margin: 0 0 8px; color: #fff; font-size: 1.1rem; }
    .category-badge {
      display: inline-block; padding: 2px 10px;
      background: rgba(124,58,237,0.2); color: #a78bfa;
      border-radius: 12px; font-size: 0.8rem;
    }
    .price { font-size: 1.3rem; font-weight: 700; color: #34d399; margin: 8px 0 4px; }
    .stock { color: #aaa; font-size: 0.85rem; }
    .low-stock { color: #f87171; }
    .university { color: #93c5fd; font-size: 0.85rem; margin-top: 4px; }
    .loading, .empty { text-align: center; padding: 40px; color: #aaa; }
    .pagination {
      display: flex; justify-content: center; align-items: center;
      gap: 16px; margin-top: 24px; padding: 16px 0;
    }
    .btn-page {
      padding: 8px 20px; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; background: transparent; color: #fff;
      cursor: pointer; transition: background 0.2s;
    }
    .btn-page:hover:not(:disabled) { background: rgba(124,58,237,0.2); }
    .btn-page:disabled { opacity: 0.3; cursor: not-allowed; }
    .page-info { color: #aaa; font-size: 0.9rem; }
  `]
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    categories: string[] = [];
    loading = false;
    searchTerm = '';
    selectedCategory = '';
    sortBy = 'createdAt';
    sortOrder: 'ASC' | 'DESC' = 'DESC';
    currentPage = 1;
    pageSize = 12;
    pagination: any = null;

    private searchTimeout: any;

    constructor(
        private productService: ProductService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts(): void {
        this.loading = true;
        const params: ProductQueryParams = {
            page: this.currentPage,
            limit: this.pageSize,
            search: this.searchTerm,
            category: this.selectedCategory,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder
        };

        this.productService.getProducts(params).subscribe({
            next: (response) => {
                this.products = response.data;
                this.pagination = response.pagination;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (response) => {
                this.categories = response.data.map(c => c.category);
            }
        });
    }

    onSearch(): void {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.loadProducts();
        }, 400);  // Debounce search
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadProducts();
    }

    viewProduct(product: Product): void {
        this.router.navigate(['/products', product.id]);
    }
}
