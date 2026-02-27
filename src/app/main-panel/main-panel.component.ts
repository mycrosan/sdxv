import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../core/service/api.service';

@Component({
  selector: 'app-main-panel',
  imports: [MatIconModule, MatTableModule, MatButtonModule, CurrencyPipe],
  templateUrl: './main-panel.component.html',
  styleUrl: './main-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPanelComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  saldo = 0;
  receitas = 0;
  despesas = 0;
  displayedColumns = ['date', 'description', 'amount', 'actions'];
  transactions: Array<{ id: string | number; date: string; description: string; amount: number; rawDate: string }> = [];
  filteredTransactions: Array<{ id: string | number; date: string; description: string; amount: number; rawDate: string }> = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.api.getAccount().subscribe(acc => {
      this.saldo = acc.balance;
      this.cdr.markForCheck();
    });

    this.loadDashboardData();
  }

  loadDashboardData() {
    this.api.getTransactions().subscribe(list => {
      const now = new Date();
      const m = now.getMonth();
      const y = now.getFullYear();
      let receitas = 0;
      let despesas = 0;

      this.transactions = list
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(t => ({
          id: t.id,
          date: new Date(t.date).toLocaleDateString('pt-BR'),
          description: t.description,
          amount: t.amount,
          rawDate: t.date
        }));

      // Initialize filtered array
      this.filterTransactions();

      for (const t of list) {
        const d = new Date(t.date);
        if (d.getMonth() === m && d.getFullYear() === y) {
          if (t.amount > 0) receitas += t.amount; else despesas += t.amount;
        }
      }
      this.receitas = receitas;
      this.despesas = despesas;
      this.cdr.markForCheck();
    });
  }

  filterTransactions() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredTransactions = [...this.transactions];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTransactions = this.transactions.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.amount.toString().includes(term) ||
        t.date.includes(term)
      );
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filterTransactions();
    this.cdr.markForCheck();
  }

  goToNewTransaction() {
    this.router.navigate(['/transferencias']);
  }

  deleteTransaction(transaction: any) {
    if (confirm(`Excluir transação: "${transaction.description}"?`)) {
      const newBalance = this.saldo - transaction.amount;
      this.api.updateAccountBalance(newBalance).subscribe(() => {
        this.api.deleteTransaction(transaction.id).subscribe(() => {
          this.saldo = newBalance;
          this.loadDashboardData();
          this.cdr.markForCheck();
          alert('Excluída com sucesso!');
        });
      });
    }
  }

  editTransaction(transaction: any) {
    const newDescription = prompt('Nova descrição:', transaction.description);
    if (!newDescription) return;

    const newAmountStr = prompt('Novo valor:', transaction.amount.toString());
    if (!newAmountStr) return;

    const newAmount = parseFloat(newAmountStr);
    if (isNaN(newAmount)) return;

    const diff = newAmount - transaction.amount;
    const newBalance = this.saldo + diff;

    const updated = {
      id: transaction.id,
      description: newDescription,
      amount: newAmount,
      date: transaction.rawDate,
      type: (newAmount >= 0 ? 'income' : 'expense') as 'income' | 'expense'
    };

    this.api.updateAccountBalance(newBalance).subscribe(() => {
      this.api.updateTransaction(updated).subscribe(() => {
        this.saldo = newBalance;
        this.loadDashboardData();
        this.cdr.markForCheck();
        alert('Atualizada com sucesso!');
      });
    });
  }
}
