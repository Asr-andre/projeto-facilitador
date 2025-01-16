import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard.component';
import { OrderTableModule } from 'src/app/core/helpers/conf-tabela/order-table.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    DashboardComponent,
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
export class DashboardModule { }
