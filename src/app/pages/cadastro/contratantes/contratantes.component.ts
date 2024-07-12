import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';

@Component({
  selector: 'app-contratantes',
  templateUrl: './contratantes.component.html',
  styleUrl: './contratantes.component.scss'
})
export class ContratantesComponent implements OnInit {
  public contratantes: ContratanteModel[] = [];
  public loading: boolean;

  constructor(
    private _contratanteService: ContratanteService,
    private _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.obterContratantes();
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa().subscribe((res) => {
      this.contratantes = res;
      this.loading = false;
    },
      (error) => {
        this._alertService.error('Ocorreu um erro ao obter os contratantes.');
        this.loading = false;
      }
    );
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public mascararCep(cep: string): string {
    if (cep) {
      return Utils.formatarCEP(cep);
    }
    return cep;
  }

  public mascararNResidencia(numero: string): string {
    if (numero) {
      return Utils.formatarNumeroResidencia(numero);
    }
    return numero;
  }
}
