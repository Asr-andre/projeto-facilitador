import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente, ClienteModel } from 'src/app/core/models/cadastro/cliente.model';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { CepModel } from 'src/app/core/models/cep.model';
import { TipoTituloModel } from 'src/app/core/models/tipo.titulo.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ConsultaCepService } from 'src/app/core/services/consulta.cep.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';
import { TipoTituloService } from 'src/app/core/services/tipo.titulo.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {
  public listarCliente: Cliente[] = [];
  public clienteSelecionado: Cliente | null = null;
  public contratantes: ContratanteModel[] = [];
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public login = this._auth.getLogin();
  public mostrarTabela: Boolean = false;
  public mostrarCardCliente: Boolean = false;
  public formCliente: FormGroup;
  public title: string = '';
  public editar: boolean = true;
  public cep = new CepModel();
  public textoPesquisa: string = "";
  public campoInvalido: boolean = false;
  public loadingMin: boolean = false;

  public tipoTitulo: TipoTituloModel;
  public formTitulo: FormGroup;
  public idContratante: string = '';
  public idCliente: string = '';

  constructor(
    private _retornoCep: ConsultaCepService,
    private _cliente: ClienteService,
    private _contratante: ContratanteService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _datePipe: DatePipe,
    private _funcoes: FuncoesService,
    private _tipoTitulo: TipoTituloService,
    private _modal: NgbModal,
    private _fbT: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.obterContratantes();
    this.inicializarFormCliente();
    this.inicializarformTitulo();
  }

  public inicializarFormCliente(dado?: ClienteModel) {
    this.formCliente = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [dado?.id_contratante || '', [Validators.required]],
      id_cliente: [dado?.id_cliente || 0],
      identificador: [dado?.identificador || ''],
      nome: [dado?.nome || ''],
      tipo_pessoa: [dado?.tipo_pessoa || ''],
      cnpj_cpf: [dado?.cnpj_cpf || '', [Validators.required]],
      rg: [dado?.rg || ''],
      orgao_expedidor: [dado?.orgao_expedidor || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      cep: [dado?.cep || '', [Validators.required]],
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
      data_nascimento: [
        dado?.data_nascimento
          ? new Date(dado.data_nascimento).toISOString().split('T')[0]
          : ''
      ]
    });
  }

  public inicializarformTitulo() {
    this.formTitulo = this._fbT.group({
      tipo_titulo: ["", Validators.required],
      parcela: ["", Validators.required],
      plano: ["", Validators.required],
      numero_contrato: ["", Validators.required],
      numero_documento: ["", Validators.required],
      vencimento: ["", Validators.required],
      produto: ["", Validators.required],
      valor: ["", Validators.required],
      id_contratante: [this.idContratante],
      id_empresa: [this.idEmpresa],
      id_cliente: [this.idCliente],
      user_login: [this.login]
    });
  }

  public abriModalTitulo(content: TemplateRef<any>): void {
    if (!this.idCliente) {
      this._alert.warning('Por favor selecione um cliente!');
      return;
    }

    this.idContratante = this.formCliente.get('id_contratante')?.value || this.clienteSelecionado.id_contratante;
    this.idCliente = this.idCliente || this.idCliente;

    this.inicializarformTitulo();
    this.obterTipoTitulo();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalTeste(content: TemplateRef<any>): void {
    this._modal.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public selecionarcliente(cliente: Cliente): void {
    this.mostrarCardCliente = true;
    this.idCliente = String(cliente.id_cliente);
    this.idContratante = String(cliente.id_contratante)
    this.title = "Atualizar Dados do Cliente"
    this.clienteSelecionado = cliente;
    this.inicializarFormCliente(cliente)
    this.editar = true;
  }

  public obterTipoTitulo() {
    this._tipoTitulo.obterTipoTitulo().subscribe((res) => {
      if (res) {
        this.tipoTitulo = res;
      }
    });
  }

  pesquisaClientes(): void {
    this.mostrarCardCliente = false;
    if (!this.textoPesquisa.trim()) {
      this.validarCampo();
      this._alert.warning('Por favor, insira um cpf ou nome para a pesquisa o cliente.');
      return;
    }

    const texto = this.textoPesquisa.replace(/[.\-\/]/g, '').trim();
    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
      nome: '',
      cnpj_cpf: ''
    };

    if (isNaN(Number(texto))) {
      dados.nome = texto;
    } else {
      dados.cnpj_cpf = texto;
    }

    this.loading = true;

    this._cliente.pesquisarCliente(dados).subscribe({
      next: (res) => {
        if (res.success === 'true' && res.cliente && res.cliente.length > 0) {
          this.listarCliente = res.cliente || [];
          this.mostrarTabela = true;
        } else {
          this.cancela()
          this.listarCliente = [];
          this._alert.warning("Cliente não localizado")
        }
        this.loading = false;
      },
      error: (err) => {
        this._alert.error('Erro ao pesquisar clientes:', err);
        this.loading = false;
      }
    });
  }

  public validarCampo() {
    this.campoInvalido = !this.textoPesquisa || this.textoPesquisa.trim().length === 0;
  }

  public obterContratantes() {
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
    },
      (error) => {
        this._alert.error('Ocorreu um erro ao obter os contratantes.');
      }
    );
  }

  public salvarCliente() {
    if (this.formCliente.invalid) {
      this._funcoes.camposInvalidos(this.formCliente);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if (this.editar == true) {
      this.editarCliente();
    } else {
      this.cadastrarCliente();
    }
  }

  public abilitarCadastro() {
    this.editar = false;
    this.mostrarCardCliente = true;
    this.title = "Cadastrar Dados do Cliente"
    this.inicializarFormCliente();
  }

  public cadastrarCliente() {
    if (this.formCliente.invalid) {
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const dadosParaEnvio = { ...this.formCliente.value };
    dadosParaEnvio.data_nascimento = this._datePipe.transform(dadosParaEnvio.data_nascimento, "dd/MM/yyyy");
    dadosParaEnvio.cnpj_cpf = dadosParaEnvio.cnpj_cpf.replace(/[.\-\/]/g, '').trim();

    this.loading = true;

    this._cliente.cadastrarCliente(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this._alert.success(res.msg);
          this.idCliente = res.id_cliente;
        } else {
          this.loading = false;
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alert.error('Ocorreu um erro ao tentar cadastrar o cliente:', err);
      }
    });
  }

  public editarCliente(): void {
    if (this.formCliente.invalid) {
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const dadosParaEnvio = { ...this.formCliente.value };
    dadosParaEnvio.data_nascimento = this._datePipe.transform(dadosParaEnvio.data_nascimento, "dd/MM/yyyy");
    dadosParaEnvio.cnpj_cpf = dadosParaEnvio.cnpj_cpf.replace(/[.\-\/]/g, '').trim();

    this.loading = true;

    this._cliente.editarCliente(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this.pesquisaClientes();
          this.formCliente.get('cnpj_cpf')?.disable();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alert.error('Ocorreu um erro ao tentar editar o cliente:', err);
      }
    });
  }

  public verificarValorNegativo(campo: string) {
    const valor = this.formTitulo.get(campo)?.value;

    if (valor <= 0) {
      this.formTitulo.get(campo)?.setValue(0);
    }
  }

  public cadastrarTitulo(): void {
    if (!this.formTitulo.valid) {
      this._funcoes.camposInvalidos(this.formTitulo);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if (!this.idCliente || !this.idEmpresa || !this.idContratante) {
      this._alert.warning('Os dados necessários não estão disponíveis.');
      return;
    }

    const dadosTitulo = {
      ...this.formTitulo.value,
      id_empresa: this.idEmpresa,
      id_cliente: this.idCliente,
      id_contratante: this.idContratante,
      vencimento: this._datePipe.transform(this.formTitulo.value.vencimento, 'dd/MM/yyyy') || ''
    };

    this.loadingMin = true;

    this._cliente.cadastrarTitulos(dadosTitulo).subscribe((res) => {
      if (res.success) {
        this._alert.success(res.msg);
        this.fechar();
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Atenção Título Já Existente, Verifique os Campos Chaves!!!');
      }
    );
  }

  public viaCep(cep: string): void {
    if (cep) {
      this._retornoCep.consultarCep(cep).then((cepResponse: CepModel | null) => {
        if (cepResponse) {
          this.cep = cepResponse; // Atualiza o objeto CEP
        } else {
          this.cep = null;
        }
      }).catch(() => {
        this.cep = null;
      });
    }
  }

  copiarLink() {
    const link = "https://link.stone.com.br/t/chk_dzqw...";
    navigator.clipboard.writeText(link);
    alert("Link copiado para a área de transferência!");
  }

  public cancela() {
    this.mostrarCardCliente = false;
    this.mostrarTabela = false;
    this.formCliente.reset();
    this.formTitulo.reset()
    this.idContratante = '';
    this.idCliente = '';
    this.editar = true;
  }

  public fechar() {
    this._modal.dismissAll();
    this.formTitulo.reset();
    this.idContratante = '';
    this.idCliente = '';
  }
}
