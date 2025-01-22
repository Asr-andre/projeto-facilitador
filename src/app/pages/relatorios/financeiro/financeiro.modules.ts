import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FinanceiroComponent } from './financeiro.component';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { GeralComponent } from './geral/geral.component';
import { PrestacaoContasComponent } from './prestacao-contas/prestacao-contas.component';
import { DiretivasModule } from 'src/app/core/directive/directive.module';

@NgModule({

  declarations: [
    FinanceiroComponent,
    GeralComponent,
    PrestacaoContasComponent
   ],
  imports: [
    CommonModule,
    DiretivasModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule,
    OrderTableModule,
    NgApexchartsModule,
    NgxPaginationModule,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FinanceiroModule { }
