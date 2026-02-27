import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountDto {
  id: number;
  name: string;
  balance: number;
}

export interface TransactionDto {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface LoanDto {
  id: number | string;
  amount: number;
  installments: number;
  monthlyPayment: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getAccount(): Observable<AccountDto> {
    return this.http.get<AccountDto>(`${this.baseUrl}/account`);
  }

  getTransactions(): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.baseUrl}/transactions`);
  }

  getLoans(): Observable<LoanDto[]> {
    return this.http.get<LoanDto[]>(`${this.baseUrl}/loans`);
  }

  requestLoan(loan: Omit<LoanDto, 'id'>): Observable<LoanDto> {
    return this.http.post<LoanDto>(`${this.baseUrl}/loans`, loan);
  }

  addTransaction(transaction: Omit<TransactionDto, 'id'>): Observable<TransactionDto> {
    return this.http.post<TransactionDto>(`${this.baseUrl}/transactions`, transaction);
  }

  updateAccountBalance(balance: number): Observable<AccountDto> {
    // Assuming there is only one account with id: 1 as per db.json
    return this.http.patch<AccountDto>(`${this.baseUrl}/account`, { balance });
  }

  deleteTransaction(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/transactions/${id}`);
  }

  updateTransaction(transaction: TransactionDto): Observable<TransactionDto> {
    return this.http.put<TransactionDto>(`${this.baseUrl}/transactions/${transaction.id}`, transaction);
  }
}
