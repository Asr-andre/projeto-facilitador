import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cadastro } from 'src/app/core/models/cadastro.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ImportacaoService } from 'src/app/core/services/importacao.service';

@Component({
  selector: 'app-importacao-manual',
  templateUrl: './importacao-manual.component.html',
  styleUrl: './importacao-manual.component.scss'
})
export class ImportacaoManualComponent implements OnInit {

  public base: Cadastro[] = [];

  constructor(
    private _alertService: AlertService,
    private _importacaoService: ImportacaoService,
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.loadImportacaoManual();
  }

  loadImportacaoManual(): void {
    this._importacaoService.loadImportacaoManual().subscribe(
      (data: Cadastro[]) => {
        this.base = data;
      },
      (error) => {
        console.error('Erro ao carregar os dados de importação manual', error);
      }
    );
  }

  public cancelar() {
    this._router.navigate(['/processamentos/importacao']);
  }

}
