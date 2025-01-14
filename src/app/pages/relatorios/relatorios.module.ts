import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatoriosRoutingModule } from './relatorios.routing.module';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { AcionamentosSinteticoComponent } from './acionamentos/acionamentos-sintetico.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { AnaliticoComponent } from './acionamentos/analitico/analitico.component';
import { SinteticoComponent } from './acionamentos/sintetico/sintetico.component';
import { AcoesRealizadasPorContratanteComponent } from './acionamentos/acoes-realizadas-por-contratante/acoes-realizadas-por-contratante.component';

@NgModule({

  declarations: [
    DashboardComponent, FinanceiroComponent, AcionamentosSinteticoComponent, AnaliticoComponent, SinteticoComponent, AcoesRealizadasPorContratanteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RelatoriosRoutingModule,
    NgbDatepickerModule,
    NgbModule,
    NgbModule,
    OrderTableModule,
    NgApexchartsModule,
    NgxPaginationModule,
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RelatoriosModule { }
