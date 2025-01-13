import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Products } from '../State/inventory.model';
import { Store } from '@ngrx/store';
import { loadItem } from '../State/inventory.actions';
import { selectItem } from '../State/inventory.selectors';
import { APIService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  orderForm!: FormGroup;
  productData:Products[] = [];
  selectedProduct: any

  constructor(private fb: FormBuilder, private store: Store, private service:APIService, 
    private toastr: ToastrService, private dialog:MatDialog) {}

  ngOnInit(): void {
    this.loadData();
    this.initializeForm();
  }

  loadData(){
    this.store.dispatch(loadItem())
          this.store.select(selectItem).subscribe((res:Products[])=>{
            this.productData = res;
          });
  }
  // Initialize the reactive form
  initializeForm(): void {
    this.orderForm = this.fb.group({
      CustomerName: ['', [Validators.required, Validators.minLength(3)]], 
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]], 
      discount: ['', [Validators.min(0), Validators.max(100)]], 
      quantity: ['', [Validators.required, Validators.min(1)]], 
      payableAmount: [{ value: '', disabled: true }],
    });

    // Calculate payable amount when price, discount, or quantity changes
    this.orderForm.valueChanges.subscribe((formValues) => {
      this.calculatePayableAmount();
    });
  }

  // Calculate payable amount
  calculatePayableAmount(): void {
    const price = this.orderForm.get('price')?.value || 0;
    const discount = this.orderForm.get('discount')?.value || 0;
    const quantity = this.orderForm.get('quantity')?.value || 1;

    const discountAmount = (price * discount) / 100;
    const payableAmount = (price - discountAmount) * quantity;

    this.orderForm.get('payableAmount')?.setValue(payableAmount, { emitEvent: false });
  }
  // Handle form submission
  onSubmit(): void {
    if (this.orderForm.valid) {
      console.log('Order submitted:', this.orderForm.getRawValue());
      let formData = this.orderForm.getRawValue();
      const updatedProduct = {
        ...this.selectedProduct,
        quantity: this.selectedProduct.quantity - formData.quantity,
      };

      if (formData.quantity > this.selectedProduct.quantity) {
        this.toastr.error('Ordered quantity exceeds than available stock.', 'Order Failed');
        return;
      }
      this.service.addOrderedData(formData).subscribe(()=>{
      this.toastr.success('Order created successfully.', 'Ordered');
      this.service.Update( this.selectedProduct.id, updatedProduct).subscribe(() => {
      });
      
    });
    } else {
      console.log('Form is invalid');
    }
  }

  close(){
    this.loadData();
    this.dialog.closeAll();
  }

  chosenProduct(event: any): void {
    const selectedProductName = event.target.value;
    // Find the selected product details
     this.selectedProduct = this.productData.find((product) => product.name === selectedProductName);
  
    if (this.selectedProduct) {
      // Set the price and discount fields based on the selected product
      this.orderForm.patchValue({
        price: this.selectedProduct.mrp,
        discount: this.selectedProduct.discount,
      });
      // Disable the fields to prevent manual changes
      this.orderForm.get('price')?.disable();
      this.orderForm.get('discount')?.disable();
  
      // Recalculate payable amount
      this.calculatePayableAmount();
    } else {
      // Reset the fields if no product is selected
      this.orderForm.patchValue({
        price: '',
        discount: '',
      });
      // Enable the fields for future use
      this.orderForm.get('price')?.enable();
      this.orderForm.get('discount')?.enable();
    }
  }
}
