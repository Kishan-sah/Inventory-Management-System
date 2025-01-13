import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dispatch-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dispatch-product.component.html',
  styleUrls: ['./dispatch-product.component.css'],
})
export class DispatchProductComponent implements OnInit {
  orderedProductData: any[] = [];
  dispatchForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: APIService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getProduct();
  }

  initializeForm() {
    this.dispatchForm = this.fb.group({
      productName: ['', Validators.required],
      orderId: ['', Validators.required],
      payableAmount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  getProduct() {
    this.service.GetOrderedData().subscribe((data) => {
      this.orderedProductData = data;
    });
  }

  onProductSelect(event: any) {
  const selectedProductName = event.target.value;

  // Filter all products with the same name
  const productsWithSameName = this.orderedProductData.filter(
    (product) => product.name === selectedProductName
  );

  if (productsWithSameName.length === 1) {
    // If there's only one product with the name, directly patch the form
    const selectedProduct = productsWithSameName[0];
    this.dispatchForm.patchValue({
      orderId: selectedProduct.id,
      payableAmount: selectedProduct.payableAmount,
    });
  } else if (productsWithSameName.length > 1) {
    // Handle multiple orders for the same product
    // For simplicity, display a prompt to select the correct order
    const selectedOrderId = prompt(
      `Multiple orders found for ${selectedProductName}. Enter the order ID:`,
      productsWithSameName.map((p) => p.id).join(", ")
    );

    const selectedProduct = productsWithSameName.find(
      (product) => product.id === selectedOrderId
    );

    if (selectedProduct) {
      this.dispatchForm.patchValue({
        orderId: selectedProduct.id,
        payableAmount: selectedProduct.payableAmount,
      });
    } else {
      this.toastr.warning(
        'Invalid selection. Please try again.',
        'Selection Error'
      );
    }
  }
}

  onSubmit() {
    const orderId = this.dispatchForm.value.orderId;
    console.log(orderId);

    // Call the delete method
    this.sellProduct(orderId);
    this.getProduct(); // Refresh the product list
  }

  close() {
    this.dialog.closeAll();
  }

  sellProduct(id: any) {
    this.service.deleteOredr(id).subscribe(() => {
      this.toastr.success('Order dispatched successfully', 'Dispatched');
      this.getProduct();
    });
  }
}
