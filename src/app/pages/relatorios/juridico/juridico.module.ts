import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { DiretivasModule } from 'src/app/core/directive/directive.module';
import { JuridicoComponent } from './juridico.component';
import { GeralComponent } from './geral/geral.component';
import { PipesModule } from 'src/app/core/pipe/pipe.module';


@NgModule({
  declarations: [
    JuridicoComponent,
    GeralComponent
   ],
  imports: [
    CommonModule,
    DiretivasModule,
    PipesModule,
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
export class JuridicoModule { }
