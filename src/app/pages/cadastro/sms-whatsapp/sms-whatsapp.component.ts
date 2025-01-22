import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { variavel } from 'src/app/core/helpers/variaveis';
import { CadastroMensagemModel, PerfilWhatsappModel } from 'src/app/core/models/cadastro/sms.whatsapp.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SmsWhatsAppService } from 'src/app/core/services/cadastro/sms.whatsapp.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-sms-whatsapp',
  templateUrl: './sms-whatsapp.component.html',
  styleUrl: './sms-whatsapp.component.scss'
})
export class SmsWhatsappComponent implements OnInit {
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public login = this._auth.getLogin();
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public idPerfilWhatsapp = 1;
  public msg: PerfilWhatsappModel[] = [];
  public mensagemForm: FormGroup;
  public editar: boolean = false;
  public maxCaractere: number = 4096;
  public mensagem: string = '';
  public dado: typeof variavel;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: PerfilWhatsappModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<PerfilWhatsappModel>>;

  constructor(
    private _modal: NgbModal,
    private _smsWhatsAppService: SmsWhatsAppService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private fb: FormBuilder,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.dado = variavel;
    this.obterMsgs();
    this.inicializarMensagemForm();
  }

  public inicializarMensagemForm(dado?: CadastroMensagemModel) {
    this.mensagemForm = this.fb.group({
      id_perfilwhatsapp: [dado?.id_perfilwhatsapp || ''],
      id_empresa: [this.idEmpresa, Validators.required],
      titulo: [dado?.titulo || '', Validators.required],
      empresa: [dado?.empresa || '', Validators.required],
      host: [dado?.host || '', Validators.required],
      usuario: [dado?.usuario || '', Validators.required],
      senha: [dado?.senha || '', Validators.required],
      sigla: [dado?.sigla || '', Validators.required],
      centro_custo: [dado?.centro_custo || '', Validators.required],
      gera_acionamento: [dado?.gera_acionamento || 'S', Validators.required],
      user_login: [this.login, Validators.required],
      mensagem: [dado?.mensagem || '', Validators.required],
      token: [dado?.token || '', Validators.required],
    });
  }

  public controleBotao() {
    if (this.mensagemForm.invalid) {
      this._funcoes.camposInvalidos(this.mensagemForm);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if(this.editar == false) {
      this.cadastraMsg();
    } else {
      this.editarMsg();
    }
  }

  public obterMsgs() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_PerfilWhatsapp: this.idPerfilWhatsapp,
      user_login: this.login
    }
    this.loading = true;
    this._smsWhatsAppService.obterMsg(dados).subscribe((res) => {
      if (res.success === "true") {
        this.msg = res.perfil_whatsapp;
        this.filtrar();
        this.atualizarQuantidadeExibida();
        this.loading = false;
      } else {
        this.loading = false;
        this._alert.error(res.msg);
      }
    });
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarMensagemForm();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastraMsg() {
    if (this.mensagemForm.valid) {
      this.loadingMin = true;
      this._smsWhatsAppService.cadastrarMsg(this.mensagemForm.value).subscribe((res) => {
        if (res.success === "true") {
          this._alert.success(res.msg);
          this.fechar();
          this.obterMsgs();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um erro ao tentar cadastrar a mensagem.");
        });
    } else {
      this.loadingMin = false;
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abriModalEditar(content: TemplateRef<any>, dados: CadastroMensagemModel): void {
    this.editar = true;
    this.inicializarMensagemForm(dados);
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarMsg() {
    if (this.mensagemForm.valid) {
      this.loadingMin = true;
      this._smsWhatsAppService.editarMsg(this.mensagemForm.value).subscribe((res) => {
        if (res.success === "true") {
          this._alert.success(res.msg);
          this.fechar();
          this.obterMsgs();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um erro ao tentar editar a mensagem.", error);
        });
    } else {
      this.loadingMin = false;
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.msg, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<PerfilWhatsappModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.msg;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public fechar() {
    this.mensagemForm.reset();
    this._modal.dismissAll();
  }

  public mostrarSenha(campoId: string, iconeId: string): void {
    Utils.alternarVisibilidadeSenha(campoId, iconeId);
  }

  public inserirVariavel(variavel: string) {
    const mensagemAtual = this.mensagemForm.get('mensagem')?.value || '';
    const novaMensagem = `${mensagemAtual} ${variavel}`.trim();
    this.mensagemForm.get('mensagem')?.setValue(novaMensagem);
  }

  public mostraConteudoTruncado(texto: string, limite: number): string {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }

  public exibirConteudoCompleto(acionamento: any, campo: string): void {
    acionamento[campo + '_visivel'] = acionamento[campo]; // Mostra o texto completo
  }

  public ocultarConteudoTruncado(acionamento: any, campo: string, limite: number): void {
    acionamento[campo + '_visivel'] = this.mostraConteudoTruncado(acionamento[campo], limite); // Volta ao texto truncado
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alert.copiado();
  }
}
