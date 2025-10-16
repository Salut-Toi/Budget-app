import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceCardComponent } from './balance-card.component';
import { AddTransactionComponent } from './add-transaction.component';
import { TransactionsTableComponent } from './transactions-table.component';

@NgModule({
  // ❌ AUCUN standalone dans declarations
  declarations: [],

  // ✅ on les met dans imports
  imports: [
    CommonModule,
    BalanceCardComponent,
    AddTransactionComponent,
    TransactionsTableComponent,
  ],

  // ✅ on peut aussi les réexporter pour les utiliser ailleurs
  exports: [
    BalanceCardComponent,
    AddTransactionComponent,
    TransactionsTableComponent,
  ],
})
export class SharedModule {}
