import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';


const routes: Routes = [
  { path: 'payment/:id', component: PaymentComponent, pathMatch: 'full'},
  {
      path: '**',
      redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
