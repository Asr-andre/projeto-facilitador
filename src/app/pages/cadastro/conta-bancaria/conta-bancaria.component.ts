import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Bancos } from 'src/app/core/models/bancos.model';
import { DadosContaBancaria } from 'src/app/core/models/cadastro/conta.bancaria.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BancoService } from 'src/app/core/services/bancos.service';
import { ContaBancariaService } from 'src/app/core/services/cadastro/conta.bancaria.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-conta-bancaria',
  templateUrl: './conta-bancaria.component.html',
  styleUrl: './conta-bancaria.component.scss'
})
export class ContaBancariaComponent implements OnInit {
  public contaBancariaForm: FormGroup;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public editar: boolean = false;
  public contaBancaria: DadosContaBancaria[] = [];
  public contaSelecionada: DadosContaBancaria;
  public bancos: Bancos [] = [];
  public titulo: string = '';
  public idCadastrado: number = 0;

  //#region Paginação
  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: any[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<DadosContaBancaria>>;
  //#endregion

  public mostrarDias = {
    AposVencimento: false,
    AntesVencimento: false
  };

  public quantidadeDias = {
    AposVencimento: null,
    AntesVencimento: null
  };

  constructor(
    private _contaBancaria: ContaBancariaService,
    private _bancos: BancoService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.obterContaBancaria();
  }

  public inicializarForm(dado?: DadosContaBancaria) {
    this.contaBancariaForm = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_boletoperfil: [dado?.id_boletoperfil ? dado.id_boletoperfil : this.idCadastrado],
      descricao: [dado?.descricao || '', Validators.required],
      banco: [dado?.banco || '', Validators.required],
      agencia: [dado?.agencia || '', Validators.required],
      agencia_dg: [dado?.agencia_dg || ''],
      conta: [dado?.conta || '', Validators.required],
      conta_dg: [dado?.conta_dg || ''],
      carteira: [dado?.carteira || ''],
      variacao: [dado?.variacao || ''],
      codigo_cedente: [dado?.codigo_cedente || '', Validators.required],
      local_pgto: [dado?.local_pgto || ''],
      instrucoes: [dado?.instrucoes || ''],
      client_id: [dado?.client_id || ''],
      client_auth: [dado?.client_auth || ''],
      client_secret: [dado?.client_secret || ''],
      client_key: [dado?.client_key || ''],
      caminho_certificado_crt: [dado?.caminho_certificado_crt || ''],
      caminho_certificado_key: [dado?.caminho_certificado_key || ''],
      local_pgto_pix: [dado?.local_pgto_pix || ''],
      instrucao_pix: [dado?.instrucao_pix || ''],
      chave_pix: [dado?.chave_pix || ''],
      client_id_pix: [dado?.client_id_pix || ''],
      client_secret_pix: [dado?.client_secret_pix || ''],
      caminho_certificado_crt_pix: [dado?.caminho_certificado_crt_pix || ''],
      caminho_certificado_key_pix: [dado?.caminho_certificado_key_pix || ''],
      host_api: [dado?.host_api || ''],
      data_cadastro: [dado?.data_cadastro || ''],
      data_alteracao: [dado?.data_alteracao || ''],
      user_login: [this.login, Validators.required],
      fator_multa: [dado?.fator_multa || 0],
      fator_juros: [dado?.fator_juros || 0],
      envia_sms: [dado?.envia_sms || 'N'],
      envia_email: [dado?.envia_email || 'N'],
      envia_whatsapp: [dado?.envia_whatsapp || 'N'],
      Aviso_Cobranca_Criada: [dado?.Aviso_Cobranca_Criada || 'N'],
      Aviso_Dia_Vencimento: [dado?.Aviso_Dia_Vencimento || 'N'],
      Aviso_Cobranca_Recebida: [dado?.Aviso_Cobranca_Recebida || 'N'],
      Aviso_Linha_Digitavel: [dado?.Aviso_Linha_Digitavel || 'N'],
      Aviso_Cobranca_Vencida: [dado?.Aviso_Cobranca_Vencida || 'N'],
      Aviso_Cobranca_Atualizada: [dado?.Aviso_Cobranca_Atualizada || 'N'],
      Aviso_Dias_Apos_Vencimento: [dado?.Aviso_Dias_Apos_Vencimento || 'N'],
      Dias_Apos_Vencimento: [dado?.Dias_Apos_Vencimento || 0],
      Aviso_Dias_Antes_Vencimento: [dado?.Aviso_Dias_Antes_Vencimento || 'N'],
      Dias_Antes_Vencimento:  [dado?.Dias_Antes_Vencimento || 0],
      Dias_Cancelar_Registro: [dado?.Dias_Cancelar_Registro || 0],
    });
  }

  public atualizarMostrarDias(campo: 'Aviso_Dias_Apos_Vencimento' | 'Aviso_Dias_Antes_Vencimento'): void {
    const aviso = this.contaBancariaForm.get(campo)?.value;
    if (campo === 'Aviso_Dias_Apos_Vencimento') {
      this.mostrarDias.AposVencimento = aviso === 'S';
    } else {
      this.mostrarDias.AntesVencimento = aviso === 'S';
    }
  }

  public atualizarQuantidadeDias(campo: 'Dias_Apos_Vencimento' | 'Dias_Antes_Vencimento'): void {
    const valor = this.contaBancariaForm.get(campo)?.value;
    if (campo === 'Dias_Apos_Vencimento') {
      this.quantidadeDias.AposVencimento = valor;
    } else {
      this.quantidadeDias.AntesVencimento = valor;
    }
  }

  public obterContaBancaria(): void {
    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
    };

    this.loading = true;
    this._contaBancaria.obterContaBancaria(dados).pipe(finalize(() => { this.loading = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true' && res.dados && res.dados.length > 0) {
          this.contaBancaria = res.dados;
          this.filtrar();
          this.atualizarQuantidadeExibida();
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Erro:', err);
      }
    });
  }

  public obterBancos(): void {
    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
    };

    this.loadingMin = true;
    this._bancos.obterBancos(dados).pipe(finalize(() => { this.loadingMin = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true' && res.bancos && res.bancos.length > 0) {
          this.bancos = res.bancos;
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Erro:', err);
      }
    });
  }

  public controleBotao() {
    if (this.contaBancariaForm.invalid) {
      this._funcoes.camposInvalidos(this.contaBancariaForm);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    this.editar ? this.editarconta() : this.cadastrarConta();
  }

  public modalCadastrar(content: TemplateRef<any>): void {
    this.editar = false;
    this.obterBancos();
    this.inicializarForm();
    this._modal.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public modalEditar(content: TemplateRef<any>, dado: any): void {
    this.editar = true;
    this.obterBancos();
    this.inicializarForm(dado)
    this._modal.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalResumo(modalResumo: any, contaSelecionada: DadosContaBancaria): void {
    this.titulo = 'Detalhes da conta bancaria';
    this.contaSelecionada = contaSelecionada;
    this._modal.open(modalResumo, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarConta(): void {
    this.loadingMin = true;
    this._contaBancaria.cadastrarContaBancaria(this.contaBancariaForm.value).pipe(finalize(() => { this.loadingMin = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this.idCadastrado = res.id_boletoperfil;
          this.editar = true;
          this.obterContaBancaria();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Erro:', err);
      }
    });
  }

  public editarconta(): void {
    this.loadingMin = true;
    this._contaBancaria.editarContaBancaria(this.contaBancariaForm.value).pipe(finalize(() => { this.loadingMin = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this.fechar();
          this.obterContaBancaria();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Erro:', err);
      }
    });
  }

  public filtrar(): void {
      this.dadosFiltrados = Utils.filtrar(this.contaBancaria, this.textoPesquisa);
      this.totalRegistros = this.dadosFiltrados.length;
    }

    public atualizarQuantidadeExibida() {
      this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
    }

    public ordenar({ column, direction }: SortEvent<DadosContaBancaria>) {
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });

      if (direction === '' || column === '') {
        this.dadosFiltrados = this.contaBancaria;
      } else {
        this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
          const res = compararParaOrdenar(a[column], b[column]);
          return direction === 'asc' ? res : -res;
        });
      }
    }

  public fechar() {
    this.mostrarDias.AntesVencimento = false;
    this.mostrarDias.AposVencimento = false;
    this.quantidadeDias.AntesVencimento = null;
    this.quantidadeDias.AposVencimento = null;
    this.contaBancariaForm.reset();
    this._modal.dismissAll();
  }
}
