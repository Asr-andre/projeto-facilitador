import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportacaoDetalhesModel, ImportacaoFormData } from './../../../core/models/importacao.model';
import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ImportacaoService } from 'src/app/core/services/importacao.service';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrl: './importacao.component.scss'
})
export class ImportacaoComponent implements OnInit {
  @ViewChild('importacaoManualModal') importManual: TemplateRef<any>;
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
    this.inicializarForm();
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

  public importManualModal(modal): void {
    this.obterContratantes();
    this.inicializarForm();
    this.carregarImportacoesManual();
    this._modalService.open(this.importManual, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public importArquivoModal(modal): void {
    this.obterContratantes();
    this.inicializarForm();
    this._modalService.open(this.importArquivo, { size: 'ms', ariaLabelledBy: 'modal-basic-title' });
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

    // Prevenir o envio automático se necessário
    event.preventDefault();
    event.stopPropagation();
  }



  public uploadFile(formData: FormData) {
    this._importacaoService.uploadFile(formData).subscribe(
      (response) => {
        console.log('Upload feito com sucesso', response);
        this._alertService.success('Arquivo enviado com sucesso');
      },
      (error) => {
        console.error('Erro no upload', error);
        this._alertService.error('Erro ao enviar o arquivo');
      }
    );
  }


  public onSubmit() {
    if (this.formImportacaoArquivo.valid) {
      const file = this.formImportacaoArquivo.get('arquivo').value;

      // Criar um Blob com o tipo MIME desejado
      const fileBlob = new Blob([file], { type: 'application/octet-stream' });

      const formDataToSend = new FormData();
      formDataToSend.append('id_empresa', this.formImportacaoArquivo.get('id_empresa').value.toString());
      formDataToSend.append('id_contratante', this.formImportacaoArquivo.get('id_contratante').value.toString());
      formDataToSend.append('arquivo', fileBlob, file.name); // Adiciona o arquivo com o tipo MIME especificado
      formDataToSend.append('user_login', this.formImportacaoArquivo.get('user_login').value);

      console.log('Form Data:', formDataToSend);

      this.uploadFile(formDataToSend);
    } else {
      this._alertService.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  public carregarImportacoesManual() {
    this.importacoesManual = [
      {
        cnpj: '12345678000195',
        nomeFantasia: 'Empresa Teste',
        endereco: 'Rua Exemplo',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        tipoTitulo: 'Dívida',
        parcela: '1/3',
        plano: 'Plano A',
        titulos: 'Título 1',
        serasa: 'Não',
        vencimento: new Date(),
        valor: 1000.00,
        celularWhatsapp: '(11) 98765-4321',
        foneComercial: '(11) 1234-5678',
        foneResidencial: '(11) 2345-6789',
        foneOutros: '(11) 3456-7890'
      }
    ];
  }

}
