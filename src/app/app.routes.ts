import { Routes } from '@angular/router';
import { BuyComponent } from '../components/buy/buy.component';
import { AddProductComponent } from '../components/addproduct/addproduct.component';

export const appRoutes: Routes = [
  { path: 'buy', component: BuyComponent },
  { path: 'addproduct', component: AddProductComponent },
  { path: '', redirectTo: '/buy', pathMatch: 'full' }
];
