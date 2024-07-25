import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ImportacaoService } from 'src/app/core/services/importacao.service';

@Component({
  selector: 'app-importacao-manual',
  templateUrl: './importacao-manual.component.html',
  styleUrl: './importacao-manual.component.scss'
})
export class ImportacaoManualComponent {

  constructor(
    private _alertService: AlertService,
    private _importacaoService: ImportacaoService,
    private _contratanteService: ContratanteService,
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  public cancelar() {
    this._router.navigate(['/processamentos/importacao']);
  }

}
