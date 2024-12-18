import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrdenarPeloHeaderTabela } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Cliente} from 'src/app/core/models/cadastro/cliente.model';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {
  public listarDevedor: Cliente[] = [];
  public devedorSelecionado: Cliente | null = null;
  public contratantes: ContratanteModel [] = [];
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public login = this._auth.getLogin();
  public mostrarTabela: Boolean = false;
  public mostrarForm: Boolean = false;
  public idCliente: Number;
  public formCliente: FormGroup;
  public title: string = '';

  public paginaAtual: number = 1;
  public itensPorPagina: number = 3;
  public dadosFiltrados: Cliente[] = [];
  public textoPesquisa: string = "";
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Cliente>>;

  public qtdeEmail: number = 0;
  public totalEmail: number = 0;
  public qtdeSms: number = 0;
  public totalSms: number = 0;
  public qtdeWhatsapp: number = 0;
  public totalWhatsapp: number = 0;
  public totalUtilizado: number = 0;
  public saldo: number = 0;

  public tipoPesquisa: string = "nome";
  public mostrarSemDivida: boolean = false;

  constructor(
    private _cliente: ClienteService,
    private _dashboard: DashboardService,
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _servicoEmpresa: EmpresaService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
    this.inicializarFormCliente();
  }

  public inicializarFormCliente(dado?: Cliente) {
    this.formCliente = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [dado?.id_contratante || ''],
      cnpj_cpf: [dado?.cnpj_cpf || ''],
      rg: [dado?.rg || ''],
      nome: [dado?.nome || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      cep: [dado?.cep || ''],
      user_login: [this.login]
    })
  }





  public selecionarDevedor(devedor: Cliente): void {
    this.mostrarForm = true;
    this.title = "Atualizar Dados do Cliente"
    this.devedorSelecionado = devedor;
    this.inicializarFormCliente(devedor)
    console.log(devedor)
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(
      this.paginaAtual * this.itensPorPagina,
      this.totalRegistros
    );
  }

  public obterContratantes() {
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
    },
      (error) => {
        this._alertService.error('Ocorreu um erro ao obter os contratantes.');
      }
    );
  }

  public abilitarCadastro() {
    this.mostrarForm = true;
    this.title = "Cadastrar Dados do Cliente"
    console.log(this.mostrarForm);
  }

  public cadastrarCliente() {

    this._servicoEmpresa.importarClientes(this.formCliente.value).subscribe((res) => {
      if (res.success === 'true') {

        this.idCliente = res.id_cliente;
        this._alertService.success(res.msg);
      } else  {
        this.loading = false;
        this._alertService.warning(res.msg);
      }
    });
  }

  pesquisaClientes(): void {
    if (!this.textoPesquisa.trim()) {
      this._alertService.warning('Por favor, insira um texto para a pesquisa.');
      return;
    }

    this.loading = true;

    this._cliente.pesquisarCliente(this.textoPesquisa.trim()).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this.listarDevedor = res.cliente || [];
          this.mostrarTabela = true;
        } else {
          this._alertService.warning(res.msg);
          this.listarDevedor = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao pesquisar clientes:', err);
        this._alertService.error('Erro ao buscar clientes. Tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

  public cancela() {
    this.mostrarForm = false;
    this.mostrarTabela =false;
    this.inicializarFormCliente();
  }
}
