import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent implements OnInit {
  formGroup!: FormGroup;
  isBrandForm: boolean = true; // To toggle between Brand and Product forms
  brands: any[] = []; // Array to hold the list of brands
  products: any[] = []; // Array to hold the list of products

  constructor(
    private fb: FormBuilder, 
    private apiService: APIService, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();
    this.initializeForm();
  }

  // Initialize form with dynamic fields
  initializeForm(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required], // Shared input for both brand and product
    });
  }

  // Toggle to show Brand or Product form
  toggleForm(isBrand: boolean): void {
    this.isBrandForm = isBrand;
    this.initializeForm();
  }

  // Submit form for either Brand or Product
  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData =  this.formGroup.value ;

      // Determine API call based on the active form
      if (this.isBrandForm) {
        this.apiService.AddBrand(formData).subscribe({
          next: () => {
            this.toastr.success('Brand added successfully', 'Added');
            this.loadBrands();
            this.formGroup.reset();
            
          },
          error: (err) => console.error('Error adding brand:', err),
        });
      } else {
        this.apiService.AddProduct(formData).subscribe({
          next: () => {
            this.toastr.success('Product added successfully', 'Added');
            this.formGroup.reset();
            this.loadProducts();
          },
          error: (err) => console.error('Error adding product:', err),
        });
      }
    }
  }

  // Load brands from the server
  loadBrands(): void {
    this.apiService.GetBrand().subscribe((data: any) => {
      this.brands = data;
    });
  }

  // Load products from the server
  loadProducts(): void {
    this.apiService.GetProduct().subscribe((data: any) => {
      this.products = data;
    });
  }

  // Delete brand
  deleteBrand(data: any): void {
    this.apiService.DeleteBrand(data.id).subscribe(() => {
      this.toastr.error('Brand deleted successfully', 'Deleted');
      this.loadBrands();
    });
  }

  // Delete product
  deleteProduct(data: any): void {
    this.apiService.DeleteProduct(data.id).subscribe(() => {
      this.toastr.error('Product deleted successfully', 'Deleted');
      this.loadProducts();
    });
  }
}
