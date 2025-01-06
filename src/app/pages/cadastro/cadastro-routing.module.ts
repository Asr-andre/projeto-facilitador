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


const routes: Routes = [
    {
      path: 'empresa', component: EmpresaComponent
    },
    {
      path: 'contratantes', component: ContratantesComponent
    },
    {
      path: 'usuarios', component: UsuariosComponent
    },
    {
      path: 'titulos', component: TitulosComponent
    },
    {
      path: 'sms-whatsapp', component: SmsWhatsappComponent
    },
    {
      path: 'email-conta', component: EmailContaComponent
    },
    {
      path: 'formula', component: FormulaComponent
    },
    {
      path: 'sms', component: SmsComponent
    },
    {
      path: 'cliente', component: ClienteComponent
    },
    {
      path: 'indice', component: IndiceComponent
    },
    {
      path: 'email-perfil', component: EmailPerfilComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CadastroRoutingModule { }
