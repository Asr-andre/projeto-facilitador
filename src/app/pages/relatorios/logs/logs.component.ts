import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit {
  public formPesquisar: FormGroup;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public exibirCard: boolean = false;
  public filtros: any = {}; // Filtros que serão enviados para o componente analítico
  public tipoRelatorio: string = '0'; // Inicializa como '0' (nenhuma seleção)

  constructor(
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
      data_inicio: ['', Validators.required],
      data_fim: ['', Validators.required],
      user_login: [this.login, Validators.required],
      tipo: ['', Validators.required]
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
}
