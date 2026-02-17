/**
 * Dashboard Component
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/interfaces';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="dashboard">
      <!-- Top Navbar -->
      <nav class="navbar">
        <div class="nav-brand">🎓 University Merch Dashboard</div>
        <div class="nav-actions">
          <span class="user-info" *ngIf="currentUser">
            👤 {{ currentUser.username }} ({{ currentUser.role }})
          </span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </nav>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>Products</h3>
            <p class="stat-value">156</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-info">
            <h3>Universities</h3>
            <p class="stat-value">24</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-info">
            <h3>Orders</h3>
            <p class="stat-value">1,247</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Revenue</h3>
            <p class="stat-value">$89,450</p>
          </div>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="quick-nav">
        <a routerLink="/products" class="nav-card">
          <span>📋</span>
          <h4>View Products</h4>
          <p>Browse, search & filter products</p>
        </a>
        <a routerLink="/orders" class="nav-card">
          <span>📊</span>
          <h4>Sales Analytics</h4>
          <p>Top universities by sales</p>
        </a>
      </div>

      <!-- Sub Route Outlet -->
      <router-outlet></router-outlet>
    </div>
  `,
    styles: [`
    .dashboard { min-height: 100vh; background: #0f0c29; color: #fff; }
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 32px; background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .nav-brand { font-size: 1.3rem; font-weight: 700; }
    .nav-actions { display: flex; align-items: center; gap: 16px; }
    .user-info { color: #aaa; font-size: 0.9rem; }
    .btn-logout {
      padding: 8px 20px; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; background: transparent; color: #fff;
      cursor: pointer; transition: background 0.2s;
    }
    .btn-logout:hover { background: rgba(239,68,68,0.2); border-color: #ef4444; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px; padding: 32px;
    }
    .stat-card {
      display: flex; align-items: center; gap: 16px;
      padding: 24px; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px; transition: border-color 0.2s;
    }
    .stat-card:hover { border-color: #7c3aed; }
    .stat-icon { font-size: 2.5rem; }
    .stat-info h3 { margin: 0; color: #aaa; font-size: 0.9rem; font-weight: 400; }
    .stat-value { margin: 4px 0 0; font-size: 1.8rem; font-weight: 700; color: #fff; }
    .quick-nav {
      display: flex; gap: 20px; padding: 0 32px 32px;
    }
    .nav-card {
      flex: 1; padding: 24px; background: rgba(124,58,237,0.08);
      border: 1px solid rgba(124,58,237,0.2); border-radius: 12px;
      text-decoration: none; color: #fff; transition: transform 0.2s;
    }
    .nav-card:hover { transform: translateY(-2px); }
    .nav-card span { font-size: 2rem; }
    .nav-card h4 { margin: 8px 0 4px; }
    .nav-card p { color: #aaa; margin: 0; font-size: 0.85rem; }
  `]
})
export class DashboardComponent implements OnInit {
    currentUser: User | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    logout(): void {
        this.authService.logout();
        window.location.href = '/login';
    }
}
