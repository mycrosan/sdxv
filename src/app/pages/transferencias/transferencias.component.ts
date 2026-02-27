import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/service/api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

interface Contact {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
}

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './transferencias.component.html',
  styleUrl: './transferencias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferenciasComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  currentBalance: number = 0;

  recentContacts: Contact[] = [
    { id: 1, name: 'Ivirson', initials: 'ID', avatarColor: 'bg-blue-500' },
    { id: 2, name: 'Priscila', initials: 'PD', avatarColor: 'bg-green-500' },
    { id: 3, name: 'Beatriz M.', initials: 'BM', avatarColor: 'bg-purple-500' },
    { id: 4, name: 'Esposa', initials: 'E', avatarColor: 'bg-yellow-500' },
    { id: 5, name: 'Mãe', initials: 'M', avatarColor: 'bg-pink-500' },
  ];

  transferForm: FormGroup = this.fb.group({
    contact: [null as Contact | null, [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    description: ['']
  });

  ngOnInit(): void {
    this.api.getAccount().subscribe((acc: any) => {
      this.currentBalance = acc.balance;
      const amountCtrl = this.transferForm.get('amount');
      if (amountCtrl) {
        amountCtrl.setValidators([
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.currentBalance)
        ]);
        amountCtrl.updateValueAndValidity();
      }
      this.cdr.markForCheck();
    });

  }

  confirmTransfer() {
    this.transferForm.markAllAsTouched();

    if (this.transferForm.invalid) {
      alert('Por favor, preencha corretamente os dados da transferência.');
      return;
    }

    const formValue = this.transferForm.value;
    const value = parseFloat(formValue.amount);

    if (value > this.currentBalance) {
      alert('Saldo insuficiente!');
      return;
    }

    const newBalance = this.currentBalance - value;
    const transaction = {
      date: new Date().toISOString(),
      description: `Transferência para ${formValue.contact.name}`,
      amount: -value,
      type: 'expense' as const
    };

    // Update balance and record transaction
    this.api.updateAccountBalance(newBalance).subscribe(() => {
      this.api.addTransaction(transaction).subscribe(() => {
        alert('Transferência realizada com sucesso!');
        this.router.navigate(['/dashboard']);
      });
    });
  }

  selectContact(contact: Contact) {
    this.transferForm.patchValue({ contact });
    this.transferForm.get('contact')?.markAsTouched();
    this.cdr.markForCheck();
  }
}
