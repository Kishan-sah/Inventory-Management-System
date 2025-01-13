import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIService } from '../api.service';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { Products } from '../State/inventory.model';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: Products[] = [];
  totalQuantity: number = 0;
  totalPrice: any;
  lowStock: number = 0;
  lowStockProducts: Products[] = [];
  categoryWiseQuantity: { category: string; totalQuantity: number }[] = [];

  constructor(private dashboardService: APIService, private route: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }
  // Fetch products from API
  fetchProducts(): void {
    this.dashboardService.getProducts().subscribe((data: Products[]) => {
      this.products = data;
      this.calculateTotals();
      this.findLowStockProducts();
      this.calculateCategoryWiseQuantity();
      this.loadCategoryChart();
      this.loadLowStockChart();
      
    });
  }

  // Calculate total quantity
  calculateTotals(): void {
    this.totalQuantity = this.products.reduce((sum, product) => sum + product.quantity, 0);
    this.totalPrice = this.products.reduce((sum, product) => sum + (product.mrp * product.quantity), 0).toLocaleString('en-IN');
    this.lowStock = this.products.filter(product => product.quantity < product.threshold).length;

  }

  // Find products below threshold
  findLowStockProducts(): void {
    this.lowStockProducts = this.products.filter(product => product.quantity < product.threshold);
  }

  calculateCategoryWiseQuantity(): void {
    const categoryMap = new Map<string, number>();

    this.products.forEach(product => {
      if (categoryMap.has(product.category)) {
        categoryMap.set(product.category, categoryMap.get(product.category)! + product.quantity);
      } else {
        categoryMap.set(product.category, product.quantity);
      }
    });

    this.categoryWiseQuantity = Array.from(categoryMap, ([category, totalQuantity]) => ({
      category,
      totalQuantity
    }));
  }


  loadLowStockChart() {
    const canvas = document.getElementById('lowStockChart') as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Canvas element for Low Stock Chart not found');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for Low Stock Chart');
      return;
    }
  
    const labels = this.lowStockProducts.map((item) => item.name);
    const data = this.lowStockProducts.map((item) => item.quantity);
  
    new Chart(ctx as CanvasRenderingContext2D, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Low Stock Items',
            data,
            backgroundColor: '#ff6384',
            borderColor: '#ff6384',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  loadCategoryChart() {
    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Canvas element for Category Chart not found');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for Category Chart');
      return;
    }
  
    const labels = this.categoryWiseQuantity.map((brand) => brand.category);
    const data = this.categoryWiseQuantity.map((brand) => brand.totalQuantity);
    const totalQuantity = data.reduce((sum, value) => sum + value, 0);
  
    new Chart(ctx as CanvasRenderingContext2D, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const index = tooltipItem.dataIndex;
                const percentage = ((data[index] / totalQuantity) * 100).toFixed(2);
                return `${labels[index]}: ${data[index]} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  inventoryManagement(){
  this.route.navigate(['manageInventory']);
  }
  
}