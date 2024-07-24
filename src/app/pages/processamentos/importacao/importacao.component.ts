import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportacaoDetalhesModel, ImportacaoRetornoModel } from './../../../core/models/importacao.model';
import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ImportacaoService } from 'src/app/core/services/importacao.service';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';

@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrl: './importacao.component.scss'
})
export class ImportacaoComponent implements OnInit {
  @ViewChild('importacaArquivoModal') modalEmailRef: TemplateRef<any>;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login: string = this._authService.getLogin();
  public importacoes: ImportacaoDetalhesModel[] = [];
  public formImportacaoArquivo: FormGroup;
  public contratantes: ContratanteModel [] = [];
  public loading: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 20;
  public dadosFiltrados: ImportacaoDetalhesModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<ImportacaoDetalhesModel>>;

  constructor(
    private _alertService: AlertService,
    private _importacaoService: ImportacaoService,
    private _contratanteService: ContratanteService,
    private _modalService: NgbModal,
    private _authService: AuthenticationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.listarImportacoesRealizadas();
  }

  public inicializarForm() {
    this.formImportacaoArquivo = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: [1, Validators.required],
      arquivo: ['', Validators.required],
      user_login: [this.login]
    });
  }

  public listarImportacoesRealizadas(): void {
    this.loading = true;
    this._importacaoService.listarImportacoesRealizada(this.idEmpresa).subscribe((res) => {
      if (res.success === "true") {
        this.loading = false;
        this.importacoes = res.dados;
        this.dadosFiltrados = res.dados;
        this.totalRegistros = res.dados.length;
        this.atualizarQuantidadeExibida();
      } else {
        this.loading = false;
        this._alertService.error(res.msg);
      }
    },
      (error) => {
        this.loading = false;
        this._alertService.error('Erro ao listar as importações');
      }
    );
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.importacoes, this.textoPesquisa);
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<ImportacaoDetalhesModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.importacoes;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public importacaoArquivoModal(modal): void {
    this.obterContratantes();
    this._modalService.open(this.modalEmailRef, { size: 'ms', ariaLabelledBy: 'modal-basic-title' });
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

  public downloadModelo(): void {
    const fileUrl = 'assets/modelo/Layout importação facilitador.xlsx';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Layout importação facilitador.xlsx';
    link.click();
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
