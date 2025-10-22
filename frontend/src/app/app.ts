import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  template: `
    <header class="shell">
      <h1>Budget App</h1>
      <nav>
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/stats">Stats</a>
      </nav>
    </header>
    <main class="shell">
      <button (click)="testApi()">Tester API</button>

      <div *ngIf="apiStatus">
        <p>✅ Connexion OK : {{ apiStatus }}</p>
      </div>
      <div *ngIf="apiError">
        <p>❌ Erreur : {{ apiError }}</p>
      </div>

      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .shell { max-width: 1080px; margin: 0 auto; padding: 1rem; }
    header { display:flex; align-items:center; gap:1rem; justify-content:space-between; }
    nav a { margin-right: .75rem; }
    button { margin-bottom: 1rem; }
  `]
})
export class AppComponent {
  apiStatus: string | null = null;
  apiError: string | null = null;

  constructor(private api: ApiService) {}

  testApi() {
    this.apiStatus = null;
    this.apiError = null;

    this.api.health().subscribe({
      next: (res: any) => this.apiStatus = res.status,
      error: (err) => this.apiError = err.message
    });
  }
}
