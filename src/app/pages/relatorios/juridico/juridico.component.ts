import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-juridico',
  templateUrl: './juridico.component.html',
  styleUrl: './juridico.component.scss'
})
export class JuridicoComponent implements OnInit  {
  public contratantes: ContratanteModel [] = [];
  public formPesquisar: FormGroup;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean = false;
  public loading: boolean = false;
  public exibirCard: boolean = false;
  public filtros: any = {}; // Filtros que serão enviados para o componente analítico
  public tipoRelatorio: string = '0'; // Inicializa como '0' (nenhuma seleção)
  public contratantesCarregados = false;

  constructor(
    private _contratante: ContratanteService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _funcoes: FuncoesService

  ) { }

  ngOnInit(): void {
    this.iniciarForm();
  }

  public iniciarForm(): void {
    this.formPesquisar = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: ["0"],
      ultimo_andamento: [""],
      id_cliente: ["0"],
      data_inicio: [""],
      data_fim: [""],
      user_login: [this.login, Validators.required],
      tipo: ["", Validators.required]
    });
  }

  public pesquisar() {
    if (this.formPesquisar.invalid) {
      this._funcoes.camposInvalidos(this.formPesquisar);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const tipoRelatorio = this.formPesquisar.value.tipo;
    this.tipoRelatorio = tipoRelatorio;

    switch (tipoRelatorio) {
      case '1':
        this.exibirCard = true;
        this.filtros = this.formPesquisar.value;
        break;

      default:
        this.exibirCard = false;
        this._alert.warning('Selecione um tipo de relatório antes de pesquisar.');
        break;
    }
  }

  public carregarContratantes(): void {
    if (!this.contratantesCarregados) {
      this.obterContratantes();
    }
  }

  public obterContratantes() {
    this.loading = true;
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alert.error("Ocorreu um erro ao obter os contratantes.");
        this.loading = false;
      }
    );
  }

  public exibirRelatorio(status: boolean) {
    this.exibirCard = status;
  }
}
