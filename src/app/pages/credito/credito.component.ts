import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService, LoanDto } from '../../core/service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './credito.component.html',
  styleUrl: './credito.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditoComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns = ['date', 'amount', 'installments', 'monthlyPayment', 'status'];
  loans: LoanDto[] = [];
  currentBalance: number = 0;

  // Simulator State
  loanAmount: number = 1000;
  installments: number = 12;
  interestRate: number = 0.025; // 2.5% monthly

  get monthlyPayment(): number {
    const r = this.interestRate;
    const n = this.installments;
    const p = this.loanAmount;
    // Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  get totalAmount(): number {
    return this.monthlyPayment * this.installments;
  }

  ngOnInit(): void {
    this.api.getAccount().subscribe((acc: any) => {
      this.currentBalance = acc.balance;
      this.cdr.markForCheck();
    });

    this.loadLoans();
  }

  loadLoans() {
    this.api.getLoans().subscribe(list => {
      this.loans = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.cdr.markForCheck();
    });
  }

  requestLoan() {
    if (this.loanAmount <= 0) return;

    const newLoan: Omit<LoanDto, 'id'> = {
      amount: this.loanAmount,
      installments: this.installments,
      monthlyPayment: this.monthlyPayment,
      interestRate: this.interestRate,
      status: 'approved',
      date: new Date().toISOString()
    };

    const loanTransaction = {
      date: new Date().toISOString(),
      description: 'Crédito Pessoal Aprovado',
      amount: this.loanAmount,
      type: 'income' as const
    };

    const newBalance = this.currentBalance + this.loanAmount;

    this.api.requestLoan(newLoan).subscribe(() => {
      this.api.updateAccountBalance(newBalance).subscribe(() => {
        this.api.addTransaction(loanTransaction).subscribe(() => {
          alert('Crédito solicitado e depositado com sucesso!');
          this.router.navigate(['/dashboard']);
        });
      });
    });
  }
}
