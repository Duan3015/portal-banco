import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes/nuevo', loadComponent: () => import('./features/customers/customer-form/customer-form').then(m => m.CustomerForm) },
      { path: 'clientes', loadComponent: () => import('./features/customers/customer-list/customer-list').then(m => m.CustomerList) },
      { path: 'cuentas', loadComponent: () => import('./features/accounts/account-create/account-create').then(m => m.AccountCreate) }
    ]
  },
  { path: '**', redirectTo: 'clientes' }
];
