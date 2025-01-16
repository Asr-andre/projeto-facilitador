import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { AcionamentosSinteticoComponent } from './acionamentos-sintetico.component';
import { AcoesRealizadasPorContratanteComponent } from './acoes-realizadas-por-contratante/acoes-realizadas-por-contratante.component';
import { AcoesRealizadasPorUsuarioComponent } from './acoes-realizadas-por-usuario/acoes-realizadas-por-usuario.component';
import { AnaliticoComponent } from './analitico/analitico.component';
import { SinteticoComponent } from './sintetico/sintetico.component';


@NgModule({
  declarations: [
    AcionamentosSinteticoComponent,
    AnaliticoComponent,
    SinteticoComponent,
    AcoesRealizadasPorContratanteComponent,
    AcoesRealizadasPorUsuarioComponent,
  ],
  imports: [
    CommonModule,
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
export class AcionamentoModule { }
