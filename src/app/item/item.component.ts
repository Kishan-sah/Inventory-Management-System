import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Products } from '../State/inventory.model';
import { Store } from '@ngrx/store';
import { addItem, updateItem } from '../State/inventory.actions';
import { APIService } from '../api.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent implements OnInit {
  addItemForm: FormGroup;
  editItem: boolean = false;
  brands: any[] = [];
  products: Products[] = [];
  ProductName: any[]=[];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private toastr: ToastrService,
    private dialog: MatDialogRef<ItemComponent>,
    private service: APIService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Products
  ) {
    const formattedDate = this.formatDate(new Date());

    this.addItemForm = this.fb.group({
      productId: [{ value: '', disabled: true }], // Auto-generated field
      category: ['', Validators.required],
      name: ['', Validators.required],
      mrp: ['', Validators.required],
      discount: ['', Validators.required],
      quantity: ['', Validators.required],
      threshold: ['', Validators.required],
      subCategory:['', Validators.required],
      date: [{ value: formattedDate, disabled: true }, Validators.required], // Formatted date
    });

    if (data) {
      this.editItem = true;
      this.addItemForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();
    this.loadProductName();

    // Generate productId only when both category and name have values
    this.addItemForm.valueChanges.subscribe(() => this.generateProductId());
  }

  onSave() {
    if (this.addItemForm.invalid) {
      this.toastr.error('Please fill out all required fields.', 'Error');
      return;
    }

    const item = this.addItemForm.getRawValue();

    if (this.editItem) {
      // Update the existing item
      this.store.dispatch(updateItem({ data: { ...this.data, ...item } }));
    } else {
      // Add a new item
      this.store.dispatch(addItem({ data: item }));
    }

    this.dialog.close(true);
  }

  close() {
    this.dialog.close();
  }

  private loadProductName(): void {
    this.service.GetProduct().subscribe({
      next: (data: any[]) => {
        this.ProductName = data;
        console.log(data);
      },
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  private loadBrands(): void {
    this.service.GetBrand().subscribe({
      next: (data: any[]) => {
        this.brands = data;
      },
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  private loadProducts(): void {
    this.service.getProducts().subscribe({
      next: (data: Products[]) => {
        this.products = data;
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  private generateProductId(): void {
    const category = this.addItemForm.get('category')?.value?.slice(0, 2)?.toUpperCase();
    const subCategory = this.addItemForm.get('subCategory')?.value?.slice(0, 2)?.toUpperCase();
    const name = this.addItemForm.get('name')?.value?.slice(0, 2)?.toUpperCase();
  
    if (!category || !subCategory) {
      this.addItemForm.get('productId')?.setValue('');
      return;
    }
  
    const year = new Date().getFullYear().toString().slice(-2);
  
    // Filter products matching the same category and name
    const matchingProducts = this.products.filter(
      (product) =>
        product.category.slice(0, 2).toUpperCase() === category &&
        product.subCategory.slice(0, 2).toUpperCase() === subCategory
    );
  
    // Determine the next product counter
    let nextCounter = 1;
  
    if (matchingProducts.length > 0) {
      // Extract counters from existing productIds
      const counters = matchingProducts.map((product) => {
        const match = product.productId?.match(/(\d{3})$/); // Match the last 3 digits
        return match ? parseInt(match[1], 10) : 0;
      });
  
      nextCounter = Math.max(...counters) + 1;
    }
  
    const counter = nextCounter.toString().padStart(3, '0'); // Pad counter to 3 digits
  
    // Generate the productId
    const productId = `${year}${category}${name}${counter}`;
    this.addItemForm.get('productId')?.setValue(productId);
  }
  
  

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd MMM yyyy, hh:mm a') || '';
  }
}
