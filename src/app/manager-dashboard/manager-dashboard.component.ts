import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DispatchProductComponent } from '../dispatch-product/dispatch-product.component';


@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent implements OnInit {
  orderedData: any[] = [];
  orderCount: number = 0;
  TotalPrice: number = 0;

  constructor(private service:APIService, private dialog:MatDialog){}

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.service.GetOrderedData().subscribe(
      (data) => {
        this.orderedData = data;
        this.calculateOrderCount();
      });
  }

  calculateOrderCount() {
    // Update order count
    this.orderCount = this.orderedData.length;
  
    // Calculate total price based on payableAmount for each product
    this.TotalPrice = this.orderedData.reduce((sum, product) => sum + product.payableAmount, 0).toLocaleString('en-IN');
  }

  Dispatch() {
    this.dialog.open(DispatchProductComponent, {
      width: 'fit-content',
      height: 'fit-content',
      panelClass: 'custom-dialog-container',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      maxWidth: '90vw', // Ensure the dialog does not exceed viewport width
      maxHeight: '90vh', // Ensure the dialog does not exceed viewport height
    });
    
  }
}
