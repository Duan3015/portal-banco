import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { AccountService } from '../../../core/services/account.service';
import { CustomerService } from '../../../core/services/customer.service';
import type { Account, AccountStatus } from '../../../models/account.model';
import type { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './account-create.html',
  styleUrl: './account-create.scss'
})
export class AccountCreate implements OnInit {
  form: FormGroup;
  customersWithoutAccount: Customer[] = [];
  createdAccount: Account | null = null;
  createdForCustomerName = '';
  loading = false;
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      documentNumber: ['', Validators.required],
      status: ['Active']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.customersWithoutAccount = customers.filter(c => !c.account);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const data = {
        documentNumber: this.form.value.documentNumber,
        status: this.form.value.status as AccountStatus
      };
      const selectedCustomer = this.customersWithoutAccount.find(c => c.documentNumber === data.documentNumber);
      this.accountService.create(data).subscribe({
        next: (account: Account) => {
          this.createdAccount = account;
          this.createdForCustomerName = selectedCustomer?.fullName ?? '';
          this.snackBar.open('Cuenta creada correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (err: { error?: { error?: string } }) => {
          this.snackBar.open(err.error?.error || 'Error al crear cuenta', 'Cerrar');
        }
      });
    }
  }

  reset(): void {
    this.createdAccount = null;
    this.createdForCustomerName = '';
    this.form.reset({ status: 'Active' });
    this.form.get('documentNumber')?.setValue('');
  }
}
