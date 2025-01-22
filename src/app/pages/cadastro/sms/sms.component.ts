import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { variavel } from 'src/app/core/helpers/variaveis';
import { PerfilSms } from 'src/app/core/models/sms.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';
import { SmsService } from 'src/app/core/services/sms.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrl: './sms.component.scss'
})
export class SmsComponent implements OnInit {
  public sms: PerfilSms [] = [];
  public smsForm: FormGroup;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public editar: boolean = false;
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public maxCaractere: number = 160;
  public mensagem: string = '';
  public dado: typeof variavel; // Usa o tipo da variável exportada

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: PerfilSms[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<PerfilSms>>;



  constructor(
    private _smsService: SmsService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
        private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.dado = variavel; // Atribui o valor exportado
    this.obterPerfilSms();
    this.inicializarMensagemForm();
  }

  public inicializarMensagemForm(dado?: PerfilSms) {
    this.smsForm = this._formBuilder.group({
      id_perfilsms: [dado?.id_perfilsms || 0],
      id_empresa: [this.idEmpresa, Validators.required],
      titulo: [dado?.titulo || '', Validators.required],
      empresa: [dado?.empresa || '', Validators.required],
      host: [dado?.host || '', Validators.required],
      usuario: [dado?.usuario || '', Validators.required],
      senha: [dado?.senha || '', Validators.required],
      sigla: [dado?.sigla || '', Validators.required],
      gera_acionamento: [dado?.gera_acionamento || 'S', Validators.required],
      user_login: [this.login, Validators.required],
      mensagem: [dado?.mensagem || '', Validators.required],
    });
    this.contarCaracteres();
  }

  public controleBotao() {
    if (this.smsForm.invalid) {
      this._funcoes.camposInvalidos(this.smsForm);
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if(this.editar == false) {
      this.cadastraSms();
    } else {
      this.editarSms();
    }
  }

  public obterPerfilSms() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_perfilsms: 0,
      user_login: this.login
    }

    this.loading = true;
    this._smsService.listarPerfilSms(dados).subscribe((res) => {
      if(res.success === "true") {
        this.sms = res.perfil_sms;
        this.loading = false;
        this.filtrar();
        this.atualizarQuantidadeExibida();
      } else {
        this.loading = false;
        this._alertService.error(res.msg);
      }
      (error) => {
        this.loading = false;
        this._alertService.error("Ocorreu um error.", error);
      }
    });
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.sms, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<PerfilSms>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.sms;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarMensagemForm();
    this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastraSms() {
    if (this.smsForm.valid) {
      this.loadingMin = true;
      this._smsService.cadastrarSms(this.smsForm.value).subscribe((res) => {
        if (res.success === "true") {
          this._alertService.success(res.msg);
          this.fechar();
          this.obterPerfilSms();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar cadastrao sms.");
        });
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abriModalEditar(content: TemplateRef<any>, dado: PerfilSms): void {
    this.editar = true;
    this.inicializarMensagemForm(dado);
    this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarSms() {
    if (this.smsForm.valid) {
      this.loadingMin = true;
      this._smsService.editarSms(this.smsForm.value).subscribe((res) => {
        if (res.success === "true") {
          this._alertService.success(res.msg);
          this.fechar();
          this.obterPerfilSms();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar editar sms.");
        });
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.smsForm.reset();
    this._modalService.dismissAll();
  }

  public mostrarSenha(campoId: string, iconeId: string): void {
    Utils.alternarVisibilidadeSenha(campoId, iconeId);
  }

  public contarCaracteres(): void {
    const mensagemControl = this.smsForm.get('mensagem');
    if (mensagemControl && mensagemControl.value.length > this.maxCaractere) {
      const truncada = mensagemControl.value.substring(0, this.maxCaractere);
      mensagemControl.setValue(truncada);
    }
  }

  public inserirVariavel(variavel: string) {
    const mensagemAtual = this.smsForm.get('mensagem')?.value || '';
    const novaMensagem = `${mensagemAtual} ${variavel}`.trim();
    this.smsForm.get('mensagem')?.setValue(novaMensagem);
  }

  public mostraConteudoTruncado(texto: string, limite: number): string {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }

  public exibirConteudoCompleto(msg: any, campo: string): void {
    msg[campo + '_visivel'] = msg[campo]; // Mostra o texto completo
  }

  public ocultarConteudoTruncado(msg: any, campo: string, limite: number): void {
    msg[campo + '_visivel'] = this.mostraConteudoTruncado(msg[campo], limite); // Volta ao texto truncado
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alertService.copiado();
  }
}
