import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportacaoComponent } from './importacao/importacao.component';

const routes: Routes = [
    {
        path: 'importacao', component: ImportacaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImportacaoRoutingModule { }
