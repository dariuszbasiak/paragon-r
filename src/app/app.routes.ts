import { Routes } from '@angular/router';
import { MyReceiptsComponent } from './my-receipts/my-receipts.component';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';

export const routes: Routes = [
  {
    path: 'my-receipts',
    component: MyReceiptsComponent,
  },
  {
    path: '',
    component: AddReceiptComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
