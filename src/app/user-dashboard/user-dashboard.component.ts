import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Products } from '../State/inventory.model';
import { selectItem } from '../State/inventory.selectors';
import { loadItem } from '../State/inventory.actions';
import { CommonModule } from '@angular/common';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
inventoryData: Products[]=[];
  ngOnInit(): void {
    this.viewData();
    }
    constructor( private dialog: MatDialog, private store:Store ){}

    viewData(){
      this.store.dispatch(loadItem())
      this.store.select(selectItem).subscribe((res:Products[])=>{
        this.inventoryData = res;
      });
     }

     purchase(){
      this.dialog.open(OrderComponent,{
        width: 'auto', 
        height: 'auto', 
        maxWidth: '90vw', 
        maxHeight: '90vh', 
        exitAnimationDuration: '1000ms',
        enterAnimationDuration: '1000ms'
            });
     }
}
