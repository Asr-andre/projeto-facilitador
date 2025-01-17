import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FinanceiroModule } from './financeiro/financeiro.modules';
import { AcionamentoModule } from './acionamentos/acionamento..module';
import { LogsModule } from './logs/logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RelatoriosRoutingModule } from './relatorios.routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RelatoriosRoutingModule,
    FinanceiroModule,
    AcionamentoModule,
    DashboardModule,
    LogsModule,
    NgbModule,
    OrderTableModule,
    NgApexchartsModule,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RelatoriosModule { }
