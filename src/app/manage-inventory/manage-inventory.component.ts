import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../State/inventory.model';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ItemComponent } from '../item/item.component';
import { Store } from '@ngrx/store';
import { deleteItem, loadItem } from '../State/inventory.actions';
import { selectItem } from '../State/inventory.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-inventory',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './manage-inventory.component.html',
  styleUrl: './manage-inventory.component.css'
})
export class ManageInventoryComponent implements OnInit {
inventoryData: Products[]=[];
subCategoryCounts: { subCategory: string; count: number }[] = [];
  ngOnInit(): void {
    this.viewData();
    }
    constructor( private dialog: MatDialog, private store:Store, private route: Router ){}

    add(){
      this.route.navigate(['addBrand']);
    }

    viewData(){
      this.store.dispatch(loadItem())
      this.store.select(selectItem).subscribe((res:Products[])=>{
        this.inventoryData = res;
        this.calculateSubCategoryCounts();
      });
     }

    addItem(){
      this.dialog.open(ItemComponent,{
        width: 'auto', // Set width to auto to fit the content
        height: 'auto', // Set height to auto to fit the content
        maxWidth: '90vw', // Optionally, limit the max width to prevent it from being too large on large screens
        maxHeight: '90vh', // Optionally, limit the max height to prevent it from being too tall
        exitAnimationDuration: '1000ms',
        enterAnimationDuration: '1000ms'
      }).afterClosed().subscribe(data =>{
        this.viewData();
      })
 }
 editItem(item: Products) {
  this.dialog.open(ItemComponent, {
    width: 'auto', // Set width to auto to fit the content
    height: 'auto', // Set height to auto to fit the content
    maxWidth: '90vw', // Optionally, limit the max width to prevent it from being too large on large screens
    maxHeight: '90vh', // Optionally, limit the max height to prevent it from being too tall
    exitAnimationDuration: '1000ms',
    enterAnimationDuration: '1000ms',
    data: item // Pass the item to be edited
  }).afterClosed().subscribe(data => {
    if (data) {
      this.viewData(); // Refresh the data after edit
    }
  });
}

deleteItem(item: Products) {
  const confirmation = window.confirm(`Are you sure you want to delete the ${item.name}?`);
  if (confirmation) {
    this.store.dispatch(deleteItem({ itemId: item.id })); // Correct action dispatch
    this.viewData(); // Optionally refresh or view updated data
  }
}
 // Calculate the count of products per subcategory
 calculateSubCategoryCounts(): void {
  const subCategoryMap = new Map<string, number>();
  this.inventoryData.forEach(product => {
    const subCategory = product.subCategory;
    if (subCategoryMap.has(subCategory)) {
      subCategoryMap.set(subCategory, subCategoryMap.get(subCategory)! + 1);
    } else {
      subCategoryMap.set(subCategory, 1);
    }
  });

  // Convert Map to Array for display
  this.subCategoryCounts = Array.from(subCategoryMap, ([subCategory, count]) => ({
    subCategory,
    count,
  }));
}
}

