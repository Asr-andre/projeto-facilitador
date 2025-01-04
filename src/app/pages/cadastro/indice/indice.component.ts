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
  public indiceSelecionado: IndiceModel;
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
      indice: [{ value: dado?.indice || '', disabled: this.editar }, Validators.required],
      data: [{ value: dado?.data ? new Date(dado?.data).toISOString().split('T')[0]
      : '', disabled: this.editar }, Validators.required],
      valor: [dado?.valor ? dado.valor.toString().replace('.', ',') : '0,00', [Validators.min(0)]],
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

        // garante que os campos que estão disabilitados tmb va no envio do form no editar
        this.formModal.get('indice')?.enable();
        this.formModal.get('data')?.enable();
        this.formModal.getRawValue();

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
      this.editar = false;
      this.form();
      this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public abriModalEditar(content: TemplateRef<any>, dados: IndiceModel): void {
      this.editar = true;
      this.form(dados);
      this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public abrirModalExcluir(content: TemplateRef<any>, dados: IndiceModel): void {
      this.indiceSelecionado = dados;
      this._modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public cadastrarIndice() {
      if (this.formModal.valid) {
        const dadosParaEnvio = { ...this.formModal.value };
        dadosParaEnvio.data = this._datePipe.transform(dadosParaEnvio.data, "dd/MM/yyyy");
        dadosParaEnvio.valor = dadosParaEnvio.valor.replace(',', '.');

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
        dadosParaEnvio.valor = dadosParaEnvio.valor.replace(',', '.');

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

    public excluirIndice() {
      const dadosParaExclusao = { ...this.indiceSelecionado,
        data: this.formatToBR(this.indiceSelecionado.data),
        user_login: this.login
      };

      this.loadingMin = true;
      this._indiceService.excluirIndice(dadosParaExclusao).subscribe((res) => {
        if (res.success === "true") {
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
        this._alert.error("Ocorreu um erro ao tentar excluir o indice.");
      });
    }

    public validarEntradaDecimal(event: KeyboardEvent): void {
      const char = event.key;
      const input = (event.target as HTMLInputElement).value;
      const regex = /^[0-9,-]$/;

      // Permite apenas números, a vírgula e o símbolo de menos no início
      if (!regex.test(char) || (char === '-' && input.length > 0)) {
        event.preventDefault();
      }
    }

    public formatarValor(event: any): void {
      let valor = event.target.value;

      // Substitui pontos por vírgulas e remove caracteres não numéricos, exceto a vírgula e o menos
      valor = valor.replace(/[^-\d,]/g, '');

      // Garante que o símbolo de menos seja apenas no início
      if (valor.includes('-')) {
        const partes = valor.split('-');
        valor = '-' + partes.join('').replace(/-/g, ''); // Remove outros traços
      }

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
