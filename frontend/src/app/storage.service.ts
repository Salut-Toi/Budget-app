import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction, TxMonthly, TxStatsCategory } from './model';

// --- Helpers localStorage (compatibles SSR) ---
const KEY = 'budget.transactions.v1';
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function readStore(): Transaction[] {
  if (!isBrowser) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeStore(items: Transaction[]) {
  if (!isBrowser) return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private items = new BehaviorSubject<Transaction[]>(readStore());
  items$ = this.items.asObservable();

  private nextId(): number {
    const max = this.items.value.reduce((m, it) => Math.max(m, it.id), 0);
    return max + 1;
  }

  list(): Transaction[] { return this.items.value; }

  add(tx: Omit<Transaction, 'id'>) {
    const newTx: Transaction = { id: this.nextId(), ...tx };
    const all = [newTx, ...this.items.value];
    writeStore(all);
    this.items.next(all);
  }

  update(id: number, patch: Partial<Omit<Transaction, 'id'>>) {
    const all = this.items.value.map(it => it.id === id ? { ...it, ...patch } : it);
    writeStore(all);
    this.items.next(all);
  }

  remove(id: number) {
    const all = this.items.value.filter(it => it.id !== id);
    writeStore(all);
    this.items.next(all); 
  }

  balance(): number {
    return this.items.value.reduce(
      (acc, it) => acc + (it.type === 'income' ? it.amount : -it.amount),
      0
    );
  }

  /** Dépenses par catégorie (normalisées : trim + lowerCase) */
  statsByCategory(): TxStatsCategory[] {
    const map = new Map<string, { label: string; total: number }>();

    for (const it of this.items.value) {
      if (it.type !== 'expense') continue;

      const raw = (it.category ?? '').trim();
      if (!raw) continue;

      const key = raw.toLowerCase(); // normalisation
      if (!map.has(key)) {
        // on garde la première écriture rencontrée comme libellé d’affichage
        map.set(key, { label: raw, total: 0 });
      }
      map.get(key)!.total += it.amount;
    }

    return [...map.values()]
      .sort((a, b) => b.total - a.total)
      .map(x => ({ category: x.label, total: x.total }));
  }

  /** Revenus / dépenses par mois (YYYY-MM) */
  statsMonthly(): TxMonthly[] {
    const months = new Map<string, { income: number; expense: number }>();

    for (const it of this.items.value) {
      const m = (it.date ?? '').slice(0, 7); // YYYY-MM
      if (!m) continue;

      if (!months.has(m)) months.set(m, { income: 0, expense: 0 });
      const slot = months.get(m)!;

      if (it.type === 'income') slot.income += it.amount;
      else slot.expense += it.amount;
    }

    return [...months.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, income: v.income, expense: v.expense }));
  }
}
