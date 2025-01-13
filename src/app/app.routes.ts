import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { BrandComponent } from './brand/brand.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { OrderComponent } from './order/order.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';


export const routes: Routes = [
  {
    path:'signupPage',
    component: SignUpComponent
  },
  {
    path:'loginPage',
    component:LoginComponent
  },
  {
    path:'adminDashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'managerDashboard',
    component: ManagerDashboardComponent, 
  },
  {
    path:'userDashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'manageInventory',
    component: ManageInventoryComponent
  },
  {
    path: 'addBrand',
    component: BrandComponent
  },
  {
    path: 'Order',
    component: OrderComponent
  }
];
