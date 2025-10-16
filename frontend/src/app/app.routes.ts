import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatsComponent } from './stats.component'; 

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: 'dashboard' },
];
