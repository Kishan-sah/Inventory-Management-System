import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private service: APIService, private route: Router, private toastr: ToastrService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;

      // Post signup data to the API
      this.service.addData(signupData).subscribe({
        next: (response:any) => {
        this.toastr.success('Account created', 'Sucessful');
        },
        error: (err:any) => {
          console.error('Signup error:', err);
          alert('Error occurred while signing up!');
        },
      });
    }
  }

  navigateToLogin(){
    this.route.navigate(['loginPage']);
  }
}