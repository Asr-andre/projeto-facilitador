import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { variavel } from 'src/app/core/helpers/variaveis';
import { MensagemEmailPerfil, RequisicaoEmailPerfil, RequisicaoPerfilEmail } from 'src/app/core/models/cadastro/email-perfil.model';
import { Indice } from 'src/app/core/models/cadastro/indice.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailPerfilService } from 'src/app/core/services/cadastro/email.perfil.service';

@Component({
  selector: 'app-email-perfil',
  templateUrl: './email-perfil.component.html',
  styleUrl: './email-perfil.component.scss'
})

export class EmailPerfilComponent implements OnInit {
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean = false;
  public loading: boolean = false;
  public mensages: MensagemEmailPerfil[] = [];
  public editar: boolean = false;
  public formEmailPerfil: FormGroup;
  public dado: typeof variavel;
  public isCollapsed = true;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: MensagemEmailPerfil[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Indice>>;

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // Negrito, Itálico, Sublinhado, Tachado
    [{ 'header': 1 }, { 'header': 2 }],               // Cabeçalhos H1 e H2
    [{ 'font': [] }],                                 // Fonte
    [{ 'size': [] }],                                 // Tamanhos de texto
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // Listas ordenadas e não ordenadas
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // Indentação
    [{ 'align': [] }],                                // Alinhamento
    [{ 'color': [] }, { 'background': [] }],          // Cor do texto e fundo
    ['blockquote', 'code-block'],                     // Bloco de citação e código
    [{ 'script': 'sub' }, { 'script': 'super' }],     // Subscrito e Sobrescrito
    [{ 'direction': 'rtl' }],                         // Direção do texto (direita para esquerda)
    //['link', 'image', 'video'],                      // Remover essas funcionalidades
    ['clean']                                         // Limpar formatação
  ];

  constructor(
    private _emailPerfil: EmailPerfilService,
    private _formBuilder: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.dado = variavel;
    this.obterEmailPerfil();
    this.inicializarFormEmailPerfil();
  }

  public inicializarFormEmailPerfil(dado?: RequisicaoPerfilEmail) {
    this.formEmailPerfil = this._formBuilder.group({
      id_emailtexto: [dado?.id_emailtexto || ""],
      id_empresa: [this.idEmpresa, Validators.required],
      descricao: [dado?.descricao || "", Validators.required],
      mensagem: [dado?.mensagem || "", Validators.required],
      user_login: [this.login, Validators.required],
    });
  }

  public controleBotao() {
    if (this.formEmailPerfil.invalid) {
      this._alert.warning('Todos os campos são obrigatorio!');
      return;
    }

    if (this.editar == true) {
      this.editarMsg();
    } else {
      this.cadastrarMsg();
    }
  }

  public obterEmailPerfil() {
    const requisicao: RequisicaoEmailPerfil = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
    }

    if (!requisicao) return;
    this.loading = true;
    this._emailPerfil.obterEmailPerfil(requisicao).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this.mensages = res.mensagens;
          this.filtrar();
          this.atualizarQuantidadeExibida();
          this.loading = false;

          this.mensages.sort((a, b) => {
            if (a.id_emailtexto < b.id_emailtexto) return 1;
            if (a.id_emailtexto > b.id_emailtexto) return -1;
            return 0;
        });

        } else {
          this.loading = false;
          this._alert.warning(res.msg);
        }
        (error) => {
          this.loading = false;
          this._alert.error("Ocorreu um error.", error);
        }
      }
    });
  };

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.mensages, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<Indice>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.mensages;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarFormEmailPerfil();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: RequisicaoPerfilEmail): void {
    this.editar = true;
    this.inicializarFormEmailPerfil(dados);
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarMsg() {
    this.loadingMin = true;
    this._emailPerfil.cadastrarEmailPerfil(this.formEmailPerfil.value).subscribe((res) => {
      this.loadingMin = false;
      if (res.success === 'true') {
        this.obterEmailPerfil();
        this.fechar();
        this._alert.success(res.msg);
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
      (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um error.", error);
      }
    });
  }

  public editarMsg() {
    this.loadingMin = true;
    this._emailPerfil.editarEmailPerfil(this.formEmailPerfil.value).subscribe((res) => {
      this.loadingMin = false;
      if (res.success === 'true') {
        this.obterEmailPerfil();
        this.fechar();
        this._alert.success(res.msg);
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
      (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um error.", error);
      }
    });
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public inserirVariavel(variavel: string) {
    const mensagemAtual = this.formEmailPerfil.get('mensagem')?.value || '';
    const novaMensagem = `${mensagemAtual} ${variavel}`.trim();
    this.formEmailPerfil.get('mensagem')?.setValue(novaMensagem);
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

  public fechar() {
    this.formEmailPerfil.reset;
    this._modal.dismissAll();
  }
}


