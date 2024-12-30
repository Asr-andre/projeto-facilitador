import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrdenarPeloHeaderTabela } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Cliente, ClienteModel} from 'src/app/core/models/cadastro/cliente.model';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';

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
  public mostrarCardCliente: Boolean = false;
  public mostrarCardTitulo: Boolean = false;
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

  public inicializarFormCliente(dado?: ClienteModel) {
    this.formCliente = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [dado?.id_contratante || ''],
      id_cliente: [dado?.id_cliente || null],
      identificador: [dado?.identificador || ''],
      nome: [dado?.nome || ''],
      tipo_pessoa: [dado?.tipo_pessoa || ''],
      cnpj_cpf: [dado?.cnpj_cpf || ''],
      rg: [dado?.rg || ''],
      orgao_expedidor: [dado?.orgao_expedidor || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      cep: [dado?.cep || ''],
      pai: [dado?.pai || ''],
      mae: [dado?.mae || ''],
      sexo: [dado?.sexo || ''],
      conjuge: [dado?.conjuge || ''],
      trabalho: [dado?.trabalho || ''],
      cargo: [dado?.cargo || ''],
      valor_renda: [dado?.valor_renda || 0],
      melhor_canal_localizacao: [dado?.melhor_canal_localizacao || ''],
      fone_celular: [dado?.fone_celular || ''],
      fone_comercial: [dado?.fone_comercial || ''],
      fone_residencial: [dado?.fone_residencial || ''],
      email: [dado?.email || ''],
      user_login: [this.login],
      data_nascimento: [dado?.data_nascimento || '']
    });
}


  public selecionarDevedor(devedor: Cliente): void {
    this.mostrarCardCliente = true;
    this.title = "Atualizar Dados do Cliente"
    this.devedorSelecionado = devedor;
    this.inicializarFormCliente(devedor)
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

  public salvarCliente() {
    if (this.devedorSelecionado.id_cliente > 0) {
      this.editarCliente();
    } else {
      this.cadastrarCliente();
    }
  }

  public abilitarCadastro() {
    this.mostrarCardCliente = true;
    this.title = "Cadastrar Dados do Cliente"
  }

  public cadastrarCliente() {
    if (this.formCliente.invalid) {
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    this.loading = true;
    this._cliente.cadastrarCliente(this.formCliente.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this._alertService.success(res.msg);
        } else {
          this._alertService.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alertService.error('Ocorreu um erro ao tentar cadastrar o cliente:', err);
      }
    });
  }

  public editarCliente(): void {
    if (this.formCliente.invalid) {
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    this.loading = true;

    // Envia os dados do formulário se for válido
    this._cliente.editarCliente(this.formCliente.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this._alertService.success(res.msg);
        } else {
          this._alertService.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alertService.error('Ocorreu um erro ao tentar editar o cliente:', err);
      }
    });
  }


  pesquisaClientes(): void {
    if (!this.textoPesquisa.trim()) {
      this._alertService.warning('Por favor, insira um texto para a pesquisa.');
      return;
    }

    const texto = this.textoPesquisa.replace(/[.\-\/]/g, '').trim();

    this.loading = true;

    this._cliente.pesquisarCliente(texto).subscribe({
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
        this._alertService.error('Erro ao pesquisar clientes:', err);
        this.loading = false;
      }
    });
  }

  public cancela() {
    this.mostrarCardCliente = false;
    this.mostrarCardTitulo = false;
    this.mostrarTabela =false;
    this.inicializarFormCliente();
  }
}
