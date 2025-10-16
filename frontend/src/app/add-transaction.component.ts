import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StorageService } from './storage.service';

type TxType = 'expense' | 'income';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <form (ngSubmit)="submit()" [formGroup]="form" class="card form-grid">
      <label>
        Type
        <select formControlName="type">
          <option value="expense">Dépense</option>
          <option value="income">Revenu</option>
        </select>
      </label>
      <label>
        Montant
        <input type="number" step="0.01" formControlName="amount" placeholder="0.00" />
      </label>
      <label>
        Catégorie
        <input type="text" formControlName="category" placeholder="ex: Logement" />
      </label>
      <label>
        Date
        <input type="date" formControlName="date" />
      </label>
      <label class="span-2">
        Description
        <input type="text" formControlName="description" placeholder="facultatif" />
      </label>
      <button class="primary" type="submit" [disabled]="form.invalid">Ajouter</button>
    </form>
  `,
  styles: [`
    .card { background:white; padding:1rem; border-radius:12px; box-shadow: 0 2px 8px rgba(0,0,0,.06); margin-bottom:1rem; }
    .form-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; align-items:end; }
    label { display:flex; flex-direction:column; font-size:.9rem; gap:.25rem; }
    .span-2 { grid-column: span 2; }
    button.primary { background:#1463f3; color:white; border:none; padding:.6rem 1rem; border-radius:10px; cursor:pointer; }
  `]
})
export class AddTransactionComponent {
  private fb = inject(FormBuilder);
  private store = inject(StorageService);

  form: FormGroup = this.fb.group({
    type: ['expense' as TxType, Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: [new Date().toISOString().slice(0,10), Validators.required],
    description: ['']
  });

  submit() {
    if (this.form.invalid) return;
    const { type, amount, category, date, description } = this.form.value;
    this.store.add({
      type: type as TxType,
      amount: Number(amount),
      category: String(category),
      date: String(date),
      description: (description ?? undefined) as string | undefined
    });
    this.form.patchValue({ amount: null, description: '' });
  }
}
