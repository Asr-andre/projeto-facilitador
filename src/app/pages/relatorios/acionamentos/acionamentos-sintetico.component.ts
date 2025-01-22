import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { UsuarioModel } from 'src/app/core/models/cadastro/usuario.model';
import { UsuarioService } from 'src/app/core/services/cadastro/usuario.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-acionamentos-sintetico',
  templateUrl: './acionamentos-sintetico.component.html',
  styleUrl: './acionamentos-sintetico.component.scss'
})
export class AcionamentosSinteticoComponent implements OnInit {
  public formPesquisar: FormGroup;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean = false;
  public loading: boolean = false;
  public exibirCard: boolean = false;
  public filtros: any = {}; // Filtros que serão enviados para o componente analítico
  public tipoRelatorio: string = '0'; // Inicializa como '0' (nenhuma seleção)

  public usuarios: UsuarioModel[];
  public contratantes: ContratanteModel[] = [];
  public contratantesCarregados = false;
  public usuariosCarregados = false;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _contratante: ContratanteService,
    private _usuarioService: UsuarioService,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit() {
    this.iniciarForm();
  }

  public iniciarForm() {
    this.formPesquisar = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: ['0'],
      id_usuario: ['0'],
      data_inicio: ['', Validators.required],
      data_fim: ['', Validators.required],
      user_login: [this.login],
      tipo: ['', Validators.required]
    });
  }

  public carregarContratantes(): void {
    if (!this.contratantesCarregados) {
      this.obterContratantes();
    }
  }

  public carregarUsuarios(): void {
    if (!this.usuariosCarregados) {
      this.obterUsuarios();
    }
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
      case '2':
      case '3':
      case '4':
        this.exibirCard = true;
        this.filtros = this.formPesquisar.value;
        break;

      default:
        this.exibirCard = false;
        this._alert.warning('Selecione um tipo de relatório antes de pesquisar.');
        break;
    }
  }

  public obterUsuarios() {
    this.loading = true;
    this._usuarioService.obterUsuariosPorEmpresa(this.idEmpresa).subscribe((res) => {
      this.usuarios = res.contratantes;
      this.loading = false;
      this.usuariosCarregados = true;
    },
      (error) => {
        this._alert.error('Ocorreu um erro ao obter os usuários.');
        this.loading = false;
      });
  }

  public obterContratantes() {
    this.loading = true;
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.loading = false;
      this.contratantes = res.contratantes;
      this.contratantesCarregados = true;
    },
      (error) => {
        this.loading = false;
        this._alert.error('Ocorreu um erro ao obter os contratantes.');
      }
    );
  }
}
