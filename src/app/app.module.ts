import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagamentoService } from './pagamento.service';
import { VariableGlobal } from './variable.global.service';
import { HttpClientModule } from '@angular/common/http';

import { PaymentComponent } from './components/payment/payment.component';


@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    
    
  ],
  providers: [PagamentoService, VariableGlobal],
  bootstrap: [AppComponent]
})
export class AppModule { }
