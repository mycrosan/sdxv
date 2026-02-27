import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./main-panel/main-panel.component').then(m => m.MainPanelComponent)
  },
  {
    path: 'extrato',
    loadComponent: () =>
      import('./pages/extrato/extrato.component').then(m => m.ExtratoComponent)
  },
  {
    path: 'transferencias',
    loadComponent: () =>
      import('./pages/transferencias/transferencias.component').then(m => m.TransferenciasComponent)
  },
  {
    path: 'credito',
    loadComponent: () =>
      import('./pages/credito/credito.component').then(m => m.CreditoComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
