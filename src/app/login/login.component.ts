import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, 
    private service:APIService, private toastr:ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Verify login credentials
      this.service.getData().subscribe(
        (users:any) => {
        const user = users.find((u:any) => u.email === email && u.password === password);

        if (user) {
          // Navigate based on role
          switch (user.role) {
            case 'Admin':
              this.router.navigate(['adminDashboard']);
              break;
            case 'Manager':
              this.router.navigate(['managerDashboard']);
              break;
            case 'Customer':
              this.router.navigate(['userDashboard']);
                break;
            default:
              alert('Invalid role!');
          }
        } else {
          this.toastr.error('Invalid Email or Password', 'Error');
        }
      });
    }
  }
  navigateToSignup(): void {
    this.router.navigate(['signupPage']); // Navigate to signup page
  }
}


