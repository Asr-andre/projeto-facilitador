import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { MensagemEmailPerfil, RequisicaoEmailPerfil } from 'src/app/core/models/cadastro/email-perfil.model';
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

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: MensagemEmailPerfil[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Indice>>;

  constructor(
    private _emailPerfil: EmailPerfilService,
    private _formBuilder: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.obterEmailPerfil();
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

    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: RequisicaoEmailPerfil): void {
    this.editar = true;

    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public fechar() {

    this._modal.dismissAll();
  }
}


