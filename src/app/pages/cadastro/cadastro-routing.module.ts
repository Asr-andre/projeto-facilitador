import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresaComponent } from './empresa/empresa.component';
import { ContratantesComponent } from './contratantes/contratantes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ClientesComponent } from './clientes/clientes.component';
import { TitulosComponent } from './titulos/titulos.component';


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
      path: 'clientes', component: ClientesComponent
    },
    {
      path: 'titulos', component: TitulosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CadastroRoutingModule { }
