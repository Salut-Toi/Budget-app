import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Ajouté
import { StorageService } from './storage.service';
import { Transaction } from './model';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Ajouté CommonModule
  template: `
<section class="card">
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Montant</th>
        <th>Catégorie</th>
        <th>Date</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let it of items">
        <ng-container *ngIf="editId !== it.id; else editTpl">
          <td>{{ it.type === 'income' ? 'Revenu' : 'Dépense' }}</td>
          <td>{{ it.amount | number:'1.2-2' }}</td>
          <td>{{ it.category }}</td>
          <td>{{ it.date }}</td>
          <td>{{ it.description }}</td>
          <td class="actions">
            <button (click)="startEdit(it)">Modifier</button>
            <button (click)="remove(it.id)">Supprimer</button>
          </td>
        </ng-container>
        <ng-template #editTpl>
          <td>
            <select [(ngModel)]="editRow.type">
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </td>
          <td><input type="number" step="0.01" [(ngModel)]="editRow.amount" /></td>
          <td><input type="text" [(ngModel)]="editRow.category" /></td>
          <td><input type="date" [(ngModel)]="editRow.date" /></td>
          <td><input type="text" [(ngModel)]="editRow.description" /></td>
          <td class="actions">
            <button (click)="saveEdit(it.id)">Enregistrer</button>
            <button (click)="cancelEdit()">Annuler</button>
          </td>
        </ng-template>
      </tr>
    </tbody>
  </table>
</section>
  `,
  styles: [`
    .card { background:white; padding:1rem; border-radius:12px; box-shadow: 0 2px 8px rgba(0,0,0,.06); margin-top:1rem; }
    table { width:100%; border-collapse: collapse; }
    th, td { padding:.5rem; border-bottom:1px solid #eee; text-align:left; }
    .actions button { margin-right:.5rem; }
  `]
})
export class TransactionsTableComponent {
  @Input() items: Transaction[] = [];
  editId: number | null = null;
  editRow: Partial<Transaction> = {};

  constructor(private store: StorageService) {}

  startEdit(it: Transaction) { this.editId = it.id; this.editRow = { ...it }; }
  cancelEdit() { this.editId = null; this.editRow = {}; }

  saveEdit(id: number) {
    this.store.update(id, {
      type: this.editRow.type!,
      amount: Number(this.editRow.amount),
      category: this.editRow.category!,
      date: this.editRow.date!,
      description: this.editRow.description || undefined
    });
    this.cancelEdit();
  }

  remove(id: number) {
    if (confirm('Supprimer cette transaction ?')) this.store.remove(id);
  }
}
