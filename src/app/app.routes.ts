import { Routes } from '@angular/router';
import { Product } from './product/product';
import { Customer } from './customer/customer';
import { Supplier } from './supplier/supplier';
import { Stock } from './stock/stock';
import { Staff } from './staff/staff';
import { Sale } from './sale/sale';

export const routes: Routes = [
    {path: '', redirectTo: 'sale', pathMatch: 'full'},
    {path: 'sale', component: Sale},
    {path: 'product', component: Product},
    {path: 'customer', component: Customer},
    {path: 'supplier', component: Supplier},
    {path: 'stock', component: Stock},
    {path: 'staff', component: Staff}
];
