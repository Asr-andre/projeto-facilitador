import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbCollapseModule, NgbDatepickerModule, NgbModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { NgxPaginationModule } from "ngx-pagination";
import { OrderTableModule } from "src/app/core/helpers/conf-tabela/order-table.module";
import { DiretivasModule } from "src/app/core/directive/directive.module";
import { PipesModule } from "src/app/core/pipe/pipe.module";
import { ClientesComponent } from "./clientes.component";
import { CadastrarComponent } from "./cadastrar/cadastrar.component";

@NgModule({
  declarations: [
    ClientesComponent,
    CadastrarComponent
  ],
  imports: [
    DiretivasModule,
    PipesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbDatepickerModule,
    NgbModule,
    NgxPaginationModule,
    OrderTableModule,
    NgbTooltipModule,
    NgbCollapseModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientesModule {}
