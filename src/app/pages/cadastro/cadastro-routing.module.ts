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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CadastroRoutingModule { }
