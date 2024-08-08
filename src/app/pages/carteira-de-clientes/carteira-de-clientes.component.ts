import { Component, OnInit } from '@angular/core';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';

@Component({
  selector: 'app-carteira-de-clientes',
  templateUrl: './carteira-de-clientes.component.html',
  styleUrl: './carteira-de-clientes.component.scss'
})
export class CarteiraDeClientesComponent implements OnInit {
  public contratantes: ContratanteModel [] = [];
  public idEmpresa = Number(this._authenticationService.getIdEmpresa());
  public filtros: boolean = false;
  public loading: boolean;

  constructor(
    private _contratanteService: ContratanteService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alertService.error('Ocorreu um erro ao obter os contratantes.');
        this.loading = false;
      }
    );
  }
}
