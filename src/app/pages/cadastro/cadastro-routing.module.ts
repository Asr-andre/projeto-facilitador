import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresaComponent } from './empresa/empresa.component';
import { ContratantesComponent } from './contratantes/contratantes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TitulosComponent } from './titulos/titulos.component';
import { SmsWhatsappComponent } from './sms-whatsapp/sms-whatsapp.component';
import { EmailContaComponent } from './email-conta/email-conta.component';
import { FormulaComponent } from './formula/formula.component';
import { SmsComponent } from './sms/sms.component';
import { ClienteComponent } from './cliente/cliente.component';
import { IndiceComponent } from './indice/indice.component';
import { EmailPerfilComponent } from './email-perfil/email-perfil.component';
import { AuthGuard } from 'src/app/core/config/auth.guard';
import { ClientesComponent } from './clientes/clientes.component';
import { ContaBancariaComponent } from './conta-bancaria/conta-bancaria.component';


const routes: Routes = [
    {
      path: 'empresa', component: EmpresaComponent, canActivate: [AuthGuard]
    },
    {
      path: 'contratantes', component: ContratantesComponent, canActivate: [AuthGuard]
    },
    {
      path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard]
    },
    {
      path: 'titulos', component: TitulosComponent, canActivate: [AuthGuard]
    },
    {
      path: 'sms-whatsapp', component: SmsWhatsappComponent, canActivate: [AuthGuard]
    },
    {
      path: 'email-conta', component: EmailContaComponent, canActivate: [AuthGuard]
    },
    {
      path: 'formula', component: FormulaComponent, canActivate: [AuthGuard]
    },
    {
      path: 'sms', component: SmsComponent, canActivate: [AuthGuard]
    },
    {
      path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard]
    },
    {
      path: 'indice', component: IndiceComponent, canActivate: [AuthGuard]
    },
    {
      path: 'email-perfil', component: EmailPerfilComponent, canActivate: [AuthGuard]
    },
    {
      path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard]
    },
    {
      path: 'conta-bancaria', component: ContaBancariaComponent, canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CadastroRoutingModule { }
