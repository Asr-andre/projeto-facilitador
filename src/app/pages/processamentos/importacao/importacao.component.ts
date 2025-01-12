import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportacaoDetalhesModel } from './../../../core/models/importacao.model';
import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ImportacaoService } from 'src/app/core/services/importacao.service';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrl: './importacao.component.scss'
})
export class ImportacaoComponent implements OnInit {
  @ViewChild('importacaoArquivoModal') importArquivo: TemplateRef<any>;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login: string = this._authService.getLogin();
  public importacoes: ImportacaoDetalhesModel[] = [];
  public formImportacaoArquivo: FormGroup;
  public formImportacaoManual: FormGroup;
  public contratantes: ContratanteModel [] = [];
  public loading: boolean = false;
  public importacoesManual: any[] = [];

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
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
    private _formBuilder: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.listarImportacoesRealizadas();
    this.inicializarForm();
  }

  public inicializarForm() {
    this.formImportacaoArquivo = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: [1, Validators.required],
      user_login: [this.login],
      arquivo: [null, Validators.required] // Adicionado para controle do arquivo
    });
  }

  public listarImportacoesRealizadas(): void {
    this.loading = true;
    this._importacaoService.listarImportacoesRealizada(this.idEmpresa).subscribe((res) => {
      if (res.success === "true") {
        this.loading = false;
        this.importacoes = res.dados;
         // Ordena a coluna data em ordem descendente
         this.importacoes.sort((a, b) => {
          if (a.id_remessa < b.id_remessa) return 1;
          if (a.id_remessa > b.id_remessa) return -1;
          return 0;
        });

        this.filtrar();
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
    this.totalRegistros = this.dadosFiltrados.length;
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

  public importArquivoModal(modal): void {
    this.obterContratantes();
    this.inicializarForm();
    this._modalService.open(this.importArquivo, { size: 'ms', ariaLabelledBy: 'modal-basic-title' , backdrop: 'static', keyboard: false });
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

  public onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file = target.files[0];
    this.formImportacaoArquivo.patchValue({
      arquivo: file
    });

    event.preventDefault();
    event.stopPropagation();
  }

  public uploadFile(file: File) {
    this._importacaoService.uploadFile(file).subscribe(
      () => {
        this.enviarDadosFormulario();
        this._alertService.success('Arquivo enviado com sucesso');
      },
      (error) => {
        this._alertService.error('Erro ao enviar o arquivo');
      }
    );
  }

  public submitForm() {
    if (this.formImportacaoArquivo.valid) {
      const arquivo = this.formImportacaoArquivo.get('arquivo').value;
      if (arquivo) {
        this.uploadFile(arquivo);
      } else {
        this._alertService.warning('Nenhum arquivo selecionado');
      }
    } else {
      this._alertService.warning('Preencha todos os campos obrigatórios');
    }
  }

  public enviarDadosFormulario() {
    const idContratante = this.formImportacaoArquivo.get('id_contratante').value;
    const userLogin = this.formImportacaoArquivo.get('user_login').value;

    this._importacaoService.enviarDadosFormulario(this.idEmpresa, idContratante, userLogin).subscribe(
      () => {
        this._alertService.success('Dados do formulário enviados com sucesso');
        // Aqui você pode querer fechar o modal ou fazer outras ações
      },
      (error) => {
        this._alertService.error('Erro ao enviar os dados do formulário');
      }
    );
  }


  public navegarParaImportacaoManual() {
    this._router.navigate(['/processamentos/importacao/importacao-manual']);
  }
}
