import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common'; // ✅ Import du pipe

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [DecimalPipe], // ✅ Ajout ici
  template: `
    <section class="card">
      <h2>Solde actuel</h2>
      <p class="amount">{{ balance | number:'1.2-2' }} XPF</p>
    </section>
  `,
  styles: [`
    .card { 
      background:white; 
      padding:1rem; 
      border-radius:12px; 
      box-shadow: 0 2px 8px rgba(0,0,0,.06); 
      margin-bottom:1rem; 
    }
    .amount { 
      font-size: 1.8rem; 
      font-weight: 700; 
    }
  `]
})
export class BalanceCardComponent { 
  @Input() balance = 0; 
}
