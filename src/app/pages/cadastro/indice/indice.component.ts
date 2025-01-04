import { DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Indice, IndiceModel } from 'src/app/core/models/cadastro/indice.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { IndiceService } from 'src/app/core/services/indice.service';

@Component({
  selector: 'app-indice',
  templateUrl: './indice.component.html',
  styleUrl: './indice.component.scss'
})
export class IndiceComponent implements OnInit {
  public indice: Indice[] = [];
  public formIndice: FormGroup;
  public formModal: FormGroup;
  public login = this._auth.getLogin();
  public loading: boolean =false;
  public loadingMin: boolean = false;
  public editar: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: Indice[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Indice>>;

  constructor(
    private _indiceService: IndiceService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modalService: NgbModal,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.iniciaForm();
    this.form();
    this.obterIndice();
  }

  public iniciaForm() {
    this.formIndice = this._fb.group({
      indice: ['INPC'],
      user_login: [this.login]
    });
  }

  public form(dado?: IndiceModel) {
    this.formModal = this._fb.group({
      indice: [dado?.indice || '', Validators.required],
      data: [dado?.data ? new Date(dado?.data).toISOString().split('T')[0]
      : '', Validators.required],
      valor: [dado?.valor || 0, [Validators.min(0)]],
      user_login: [dado?.user_login || this.login, Validators.required]
    });
  }

  public obterIndice() {
    this.loading = true;
    this._indiceService.listarIndice(this.formIndice.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this.indice = res.dados;

           // Ordena a coluna data em ordem descendente
          this.indice.sort((a, b) => {
            if (a.data < b.data) return 1;
            if (a.data > b.data) return -1;
            return 0;
          });

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
  }

  public filtrar(): void {
      this.dadosFiltrados = Utils.filtrar(this.indice, this.textoPesquisa);
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
        this.dadosFiltrados = this.indice;
      } else {
        this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
          const res = compararParaOrdenar(a[column], b[column]);
          return direction === 'asc' ? res : -res;
        });
      }
    }

    formatToBR(date: string | null): string {
      if (!date) return '';

      // Dividir a string de data ISO e usar apenas a parte da data
      const [year, month, day] = date.split('T')[0].split('-');
      return `${day}/${month}/${year}`; // Formato dd/MM/yyyy
    }

    public salvarCliente() {
      if (this.formModal.invalid) {
        this.marcarCamposComoTocados(this.formModal);
        this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
        return;
      }

      if (this.editar == true) {
        this.editarIndice();
      } else {
        this.cadastrarIndice();
      }
    }

    private marcarCamposComoTocados(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach((campo) => {
        const controle = formGroup.get(campo);
        controle?.markAsTouched();
        controle?.updateValueAndValidity();
      });
    }

    public abriModalCadastro(content: TemplateRef<any>): void {
      this.form();
      this.editar = false;
      this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public abriModalEditar(content: TemplateRef<any>, dados: IndiceModel): void {
      this.editar = true;
      this.form(dados);
      this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public cadastrarIndice() {
      if (this.formModal.valid) {
        const dadosParaEnvio = { ...this.formModal.value };
        dadosParaEnvio.data = this._datePipe.transform(dadosParaEnvio.data, "dd/MM/yyyy");

        this.loadingMin = true;
        this._indiceService.cadastrarIndice(dadosParaEnvio).subscribe((res) => {
          if(res.success === "true") {
            this.loadingMin = false;
            this.obterIndice();
            this._alert.success(res.msg);
            this.fechar();
          } else {
            this.loadingMin = false;
            this._alert.warning(res.msg);
          }
        },
          (error) => {
            this.loadingMin = false;
            this._alert.error("Ocorreu um erro ao tentar cadastrar o indice.");
          }
        );
      } else {
        this.loadingMin = false;
        this._alert.warning("Preencha todos os campos obrigatórios");
      }
    }

    public editarIndice() {
      if (this.formModal.valid) {
        const dadosParaEnvio = { ...this.formModal.value };
        dadosParaEnvio.data = this._datePipe.transform(dadosParaEnvio.data, "dd/MM/yyyy");

        this.loadingMin = true;
        this._indiceService.editarIndice(dadosParaEnvio).subscribe((res) => {
          if(res.success === "true") {
            this.loadingMin = false;
            this.obterIndice();
            this._alert.success(res.msg);
            this.fechar();
          } else {
            this.loadingMin = false;
            this._alert.warning(res.msg);
          }
        },
          (error) => {
            this.loadingMin = false;
            this._alert.error("Ocorreu um erro ao tentar editar o indice.");
          }
        );
      } else {
        this.loadingMin = false;
        this._alert.warning("Preencha todos os campos obrigatórios");
      }
    }

    public validarEntradaDecimal(event: KeyboardEvent): void {
      const char = event.key;
      const regex = /^[0-9,]$/;

      // Permite apenas números e a vírgula
      if (!regex.test(char)) {
        event.preventDefault();
      }
    }

    public formatarValor(event: any): void {
      let valor = event.target.value;

      // Substitui pontos por vírgulas e remove caracteres não numéricos, exceto a vírgula
      valor = valor.replace(/[^\d,]/g, '');

      // Remove vírgulas extras
      const partes = valor.split(',');
      if (partes.length > 2) {
        valor = partes[0] + ',' + partes[1].slice(0, 2); // Limita a duas casas decimais
      }

      event.target.value = valor;
      this.formModal.get('valor')?.setValue(valor); // Atualiza o valor no formulário
    }

    public fechar() {
      this.formModal.reset();
      this._modalService.dismissAll();
    }
}
