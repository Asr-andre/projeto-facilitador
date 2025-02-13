import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FinanceiroComponent } from "./financeiro/financeiro.component";
import { LogsComponent } from "./logs/logs.component";
import { AcionamentosSinteticoComponent } from "./acionamentos/acionamentos-sintetico.component";
import { AuthGuard } from "src/app/core/config/auth.guard";
import { JuridicoComponent } from "./juridico/juridico.component";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "financeiro",component: FinanceiroComponent, canActivate: [AuthGuard] },
  { path: "juridico", component: JuridicoComponent, canActivate: [AuthGuard] },
  { path: 'logs', component: LogsComponent, canActivate: [AuthGuard] },
  { path: 'acionamentos', component: AcionamentosSinteticoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosRoutingModule { }
