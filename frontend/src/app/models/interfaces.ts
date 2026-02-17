/**
 * TypeScript Interfaces (Models)
 * 
 * INTERVIEW POINT: Strong typing — TypeScript interfaces serve as
 * the "contract" between frontend and backend, similar to C# DTOs.
 */

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'manager';
    isActive: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    imageUrl?: string;
    isActive: boolean;
    universityId: string;
    university?: University;
    createdAt: string;
    updatedAt: string;
}

export interface University {
    id: string;
    name: string;
    location?: string;
    contactEmail?: string;
}

export interface Order {
    id: string;
    productId: string;
    universityId: string;
    quantity: number;
    amount: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    orderDate: string;
    product?: Product;
    university?: University;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface TopUniversity {
    universityId: string;
    totalSales: number;
    orderCount: number;
    university: University;
}
