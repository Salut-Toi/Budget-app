import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { Transaction } from './model';
import { BalanceCardComponent } from './balance-card.component';
import { AddTransactionComponent } from './add-transaction.component'; // ⬅️ IMPORTANT
import { TransactionsTableComponent } from './transactions-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BalanceCardComponent, AddTransactionComponent, TransactionsTableComponent], // ⬅️ IMPORTANT
  template: `
    <app-balance-card [balance]="balance"></app-balance-card>
    <app-add-transaction></app-add-transaction>
    <app-transactions-table [items]="items"></app-transactions-table>
  `
})
export class DashboardComponent implements OnInit {
  items: Transaction[] = [];
  balance = 0;
  constructor(private store: StorageService) {}
  ngOnInit(){ this.refresh(); this.store.items$.subscribe(()=>this.refresh()); }
  private refresh(){ this.items = this.store.list(); this.balance = this.store.balance(); }
}
