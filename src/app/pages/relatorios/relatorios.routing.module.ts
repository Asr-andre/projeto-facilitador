import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FinanceiroComponent } from "./financeiro/financeiro.component";
import { LogsComponent } from "./logs/logs.component";
import { AcionamentosSinteticoComponent } from "./acionamentos/acionamentos-sintetico.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "financeiro",
    component: FinanceiroComponent,
  },
    {
      path: 'logs', component: LogsComponent,
    },
    {
      path: 'acionamentos', component: AcionamentosSinteticoComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosRoutingModule {}
