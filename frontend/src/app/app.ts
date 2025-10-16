import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="shell">
      <h1>Budget App</h1>
      <nav>
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/stats">Stats</a>
      </nav>
    </header>
    <main class="shell">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .shell { max-width: 1080px; margin: 0 auto; padding: 1rem; }
    header { display:flex; align-items:center; gap:1rem; justify-content:space-between; }
    nav a { margin-right: .75rem; }
  `]
})
export class AppComponent {}
