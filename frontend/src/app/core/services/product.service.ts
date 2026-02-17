/**
 * Product Service
 * 
 * INTERVIEW POINT: Uses HttpParams for query parameters —
 * clean, type-safe way to build URL query strings.
 * RxJS Observables handle async data streams.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, PaginatedResponse, ApiResponse } from '../../models/interfaces';

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(params: ProductQueryParams = {}): Observable<PaginatedResponse<Product>> {
        let httpParams = new HttpParams();

        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.category) httpParams = httpParams.set('category', params.category);
        if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
        if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

        return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params: httpParams });
    }

    getProductById(id: string): Observable<ApiResponse<Product>> {
        return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>> {
        return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    getCategories(): Observable<ApiResponse<{ category: string }[]>> {
        return this.http.get<ApiResponse<{ category: string }[]>>(`${this.apiUrl}/categories`);
    }
}
