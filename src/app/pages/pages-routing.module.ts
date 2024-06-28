import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'cadastro', loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule) },
    { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then(m => m.RelatoriosModule) },
    { path: 'processamentos', loadChildren: () => import('./processamentos/processamentos.module').then(m => m.ProcessamentosModule) },
    { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
    { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UIModule) },
    { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
