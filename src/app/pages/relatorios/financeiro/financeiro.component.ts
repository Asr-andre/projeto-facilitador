import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent implements OnInit  {
  public contratantes: ContratanteModel [] = [];
  public formPesquisar: FormGroup;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean = false;
  public loading: boolean = false;
  public exibirCard: boolean = false;
  public filtros: any = {}; // Filtros que serão enviados para o componente analítico
  public tipoRelatorio: string = '0'; // Inicializa como '0' (nenhuma seleção)
  public contratantesCarregados = false;

  constructor(
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _alert: AlertService,

  ) { }

  ngOnInit(): void {
    this.iniciarForm();
  }

  public iniciarForm(): void {
    this.formPesquisar = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: ["0"],
      data_inicio: [this.primeirDiaMes(), Validators.required],
      data_fim: [this.ultimoDiaMes(), Validators.required],
      user_login: [this.login, Validators.required],
      tipo: ['', Validators.required]
    });
  }

  public pesquisar() {
    if (this.formPesquisar.invalid) {
      this.marcarCamposComoTocados(this.formPesquisar);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const tipoRelatorio = this.formPesquisar.value.tipo;
    this.tipoRelatorio = tipoRelatorio;

    switch (tipoRelatorio) {
      case '1':
      case '2':
        this.exibirCard = true;
        this.filtros = this.formPesquisar.value;
        break;

      default:
        this.exibirCard = false;
        this._alert.warning('Selecione um tipo de relatório antes de pesquisar.');
        break;
    }
  }

  private marcarCamposComoTocados(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      controle?.updateValueAndValidity();
    });
  }

  private primeirDiaMes() {
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    if (mes <= 9) {
      return ano + '-0' + mes + '-' + '01';
    }

    return ano + '-' + mes + '-' + '01';
  }

  private ultimoDiaMes(): string {
    let today = new Date();

    // Defina a data para o primeiro dia do próximo mês
    let primeiroDiaProximoMes = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    primeiroDiaProximoMes.setDate(primeiroDiaProximoMes.getDate() - 1);

    let data = primeiroDiaProximoMes.toISOString().split('T')[0];

    return data;
  }

  public carregarContratantes(): void {
    if (!this.contratantesCarregados) {
      this.obterContratantes();
    }
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alert.error("Ocorreu um erro ao obter os contratantes.");
        this.loading = false;
      }
    );
  }
}
