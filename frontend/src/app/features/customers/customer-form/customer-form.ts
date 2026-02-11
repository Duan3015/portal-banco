import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerService } from '../../../core/services/customer.service';
import { DocumentType } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerForm {
  form: FormGroup;
  documentTypes: DocumentType[] = ['CC', 'CE', 'PAS'];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      documentType: ['CC', Validators.required],
      documentNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.customerService.create(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Cliente creado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/clientes']);
        },
        error: (err: { error?: { error?: string } }) => {
          this.snackBar.open(err.error?.error || 'Error al crear cliente', 'Cerrar');
        }
      });
    }
  }
}
