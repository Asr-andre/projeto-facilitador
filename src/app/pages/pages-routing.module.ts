import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilaComponent } from './fila/fila.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'cadastro', loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule) },
    { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then(m => m.RelatoriosModule) },
    { path: 'processamentos', loadChildren: () => import('./processamentos/processamentos.module').then(m => m.ProcessamentosModule) },
    { path: 'fila', component: FilaComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
