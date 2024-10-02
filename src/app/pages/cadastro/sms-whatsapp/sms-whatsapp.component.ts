import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { CadastroMensagemModel, PerfilWhatsappModel } from 'src/app/core/models/cadastro/sms.whatsapp.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SmsWhatsAppService } from 'src/app/core/services/cadastro/sms.whatsapp.service';

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
    private _modalService: NgbModal,
    private _smsWhatsAppService: SmsWhatsAppService,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.obterMsgs();
    this.inicializarMensagemForm();
  }

  public inicializarMensagemForm(dado?: CadastroMensagemModel) {
    this.mensagemForm = this.fb.group({
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
        this._alertService.error(res.msg);
      }
    });
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarMensagemForm();
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastraMsg() {
    if (this.mensagemForm.valid) {
      this.loadingMin = true;
      this._smsWhatsAppService.cadastrarMsg(this.mensagemForm.value).subscribe((res) => {
        if (res.success === "true") {
          this._alertService.success(res.msg);
          this.fechar();
          this.obterMsgs();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar cadastrar a mensagem.");
        });
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abriModalEditar(content: TemplateRef<any>, dados: CadastroMensagemModel): void {
    this.editar = true;
    this.inicializarMensagemForm(dados);
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarMsg() {
    if (this.mensagemForm.valid) {
      this.loadingMin = true;
      this._smsWhatsAppService.editarMsg(this.mensagemForm.value).subscribe((res) => {
        if (res.success === "true") {
          this._alertService.success(res.msg);
          this.fechar();
          this.obterMsgs();
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar editar a mensagem.", error);
        });
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
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
    this._modalService.dismissAll();
  }

  public mostrarSenha(campoId: string, iconeId: string): void {
    Utils.alternarVisibilidadeSenha(campoId, iconeId);
  }
}
