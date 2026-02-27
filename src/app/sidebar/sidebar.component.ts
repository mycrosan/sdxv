import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  items = [
    { label: 'Painel', route: '/dashboard', icon: 'dashboard' },
    { label: 'Extrato', route: '/extrato', icon: 'receipt_long' },
    { label: 'Transferências', route: '/transferencias', icon: 'swap_horiz' },
    { label: 'Crédito', route: '/credito', icon: 'credit_card' }
  ];
}
