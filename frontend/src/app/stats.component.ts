import { Component, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions, TooltipItem } from 'chart.js';
import 'chart.js/auto';
import { StorageService } from './storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <section class="grid">
      <div class="card chart">
        <h3>Dépenses par catégorie</h3>

        <!-- Evite l'instanciation du canvas/directive côté serveur -->
        <ng-container *ngIf="isBrowser; else chartSkeleton">
          <div class="chart-holder">
            <canvas
              baseChart
              [data]="pieData"
              [type]="'pie'"
              [options]="pieOptions">
            </canvas>
          </div>
        </ng-container>
      </div>

      <div class="card chart">
        <h3>Revenus / Dépenses par mois</h3>

        <ng-container *ngIf="isBrowser; else chartSkeleton">
          <div class="chart-holder">
            <canvas
              baseChart
              [data]="barData"
              [type]="'bar'"
              [options]="barOptions">
            </canvas>
          </div>
        </ng-container>
      </div>
    </section>

    <ng-template #chartSkeleton>
      <div class="chart-holder placeholder">
        <span>Chargement…</span>
      </div>
    </ng-template>
  `,
  styles: [`
    .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap:1rem; }
    .card { background:#fff; padding:1rem; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .chart { display:flex; flex-direction:column; height:360px; }
    .chart h3 { margin:0 0 .5rem; }
    .chart-holder { position:relative; flex:1 1 auto; width:100%; min-height:260px; overflow:hidden; }
    .chart-holder.placeholder { display:flex; align-items:center; justify-content:center; opacity:.6; }
    canvas { display:block; width:100% !important; height:100% !important; }
  `]
})
export class StatsComponent implements OnInit, OnDestroy {
  private sub?: Subscription;
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));  // 🔑 guard SSR

  private readonly COLORS = [
    '#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f',
    '#edc949','#af7aa1','#ff9da7','#9c755f','#bab0ab'
  ];

  // --- PIE ---
  pieData: ChartData<'pie', number[], string> = {
    labels: [], datasets: [{ data: [], backgroundColor: [] }]
  };

  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'pie'>) => {
            const label = ctx.label ?? '';
            const val = Number(ctx.parsed);
            const data = (ctx.dataset.data as number[]) || [];
            const total = data.reduce((a,b) => a + Number(b || 0), 0);
            const pct = total ? (val / total) * 100 : 0;
            return `${label}: ${val.toLocaleString()} (${pct.toFixed(1)}%)`;
          }
        }
      }
    }
  };

  // --- BAR ---
  barData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Revenus', data: [] } as ChartDataset<'bar'>,
      { label: 'Dépenses', data: [] } as ChartDataset<'bar'>
    ]
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } }
  };

  constructor(private store: StorageService) {}

  ngOnInit() {
    if (this.isBrowser) {           // 🔑 n’accède aux APIs que côté client
      this.rebuildCharts();
      this.sub = this.store.items$.subscribe(() => this.rebuildCharts());
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private rebuildCharts() {
    const byCat = this.store.statsByCategory() ?? [];
    const labels = byCat.map(x => x.category);
    const values = byCat.map(x => x.total);
    const bg = labels.map((_, i) => this.COLORS[i % this.COLORS.length]);

    this.pieData = { labels, datasets: [{ data: values, backgroundColor: bg }] };

    const monthly = this.store.statsMonthly() ?? [];
    this.barData = {
      labels: monthly.map(x => x.month),
      datasets: [
        { label: 'Revenus', data: monthly.map(x => x.income) } as ChartDataset<'bar'>,
        { label: 'Dépenses', data: monthly.map(x => x.expense) } as ChartDataset<'bar'>
      ]
    };
  }
}
