import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/service/api.service';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './extrato.component.html',
  styleUrl: './extrato.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtratoComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  transactions: Array<{ id: string | number, rawDate: Date; fullDate: string; monthShort: string; description: string; amount: number; type: 'credit' | 'debit' }> = [];
  currentBalance: number = 0;

  ngOnInit(): void {
    this.api.getAccount().subscribe((acc: any) => {
      this.currentBalance = acc.balance;
    });

    this.loadTransactions();
  }

  loadTransactions() {
    this.api.getTransactions().subscribe(list => {
      this.transactions = list
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(t => ({
          id: t.id,
          rawDate: new Date(t.date),
          fullDate: new Date(t.date).toLocaleDateString('pt-BR'),
          monthShort: new Intl.DateTimeFormat('pt-BR', { month: 'short' })
            .format(new Date(t.date))
            .replace('.', '')
            .toUpperCase(),
          description: t.description,
          amount: t.amount,
          type: t.amount >= 0 ? 'credit' : 'debit'
        }));
      this.cdr.markForCheck();
    });
  }

  deleteTransaction(transaction: any) {
    if (confirm(`Deseja realmente excluir a transação: "${transaction.description}"?`)) {
      const newBalance = this.currentBalance - transaction.amount;

      this.api.updateAccountBalance(newBalance).subscribe(() => {
        this.api.deleteTransaction(transaction.id).subscribe(() => {
          this.currentBalance = newBalance;
          this.loadTransactions();
          alert('Transação excluída com sucesso!');
        });
      });
    }
  }

  editTransaction(transaction: any) {
    const newDescription = prompt('Editar descrição:', transaction.description);
    if (newDescription === null) return;

    const newAmountStr = prompt('Editar valor:', transaction.amount.toString());
    if (newAmountStr === null) return;

    const newAmount = parseFloat(newAmountStr);
    if (isNaN(newAmount)) {
      alert('Valor inválido!');
      return;
    }

    const amountDiff = newAmount - transaction.amount;
    const newBalance = this.currentBalance + amountDiff;

    const updatedTransaction = {
      id: transaction.id,
      description: newDescription,
      amount: newAmount,
      date: transaction.rawDate.toISOString(),
      type: (newAmount >= 0 ? 'income' : 'expense') as 'income' | 'expense'
    };

    this.api.updateAccountBalance(newBalance).subscribe(() => {
      this.api.updateTransaction(updatedTransaction).subscribe(() => {
        this.currentBalance = newBalance;
        this.loadTransactions();
        alert('Transação atualizada com sucesso!');
      });
    });
  }
}
