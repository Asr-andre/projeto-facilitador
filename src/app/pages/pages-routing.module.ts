import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilaComponent } from './fila/fila.component';
import { CarteiraDeClientesComponent } from './carteira-de-clientes/carteira-de-clientes.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'cadastro', loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule), canActivate: [AuthGuard] },
    { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then(m => m.RelatoriosModule), canActivate: [AuthGuard] },
    { path: 'processamentos', loadChildren: () => import('./processamentos/processamentos.module').then(m => m.ProcessamentosModule), canActivate: [AuthGuard] },
    { path: 'fila', component: FilaComponent, canActivate: [AuthGuard] },
    { path: 'carteira-de-clientes', component: CarteiraDeClientesComponent, canActivate: [AuthGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
