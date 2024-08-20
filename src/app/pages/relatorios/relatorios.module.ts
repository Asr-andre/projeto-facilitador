import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatoriosRoutingModule } from './relatorios.routing.module';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';


@NgModule({

  declarations: [DashboardComponent, FinanceiroComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RelatoriosRoutingModule,
    NgbDatepickerModule,
    NgbModule,
    NgbModule,
    OrderTableModule,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RelatoriosModule { }
