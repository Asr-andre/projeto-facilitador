import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportacaoComponent } from './importacao/importacao.component';
import { ImportacaoManualComponent } from './importacao/componente/importacao-manual/importacao-manual.component';

const routes: Routes = [
    { path: 'importacao', component: ImportacaoComponent },
    { path: 'importacao/importacao-manual', component: ImportacaoManualComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImportacaoRoutingModule { }
