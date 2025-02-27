import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Formula, FormulaRequest } from 'src/app/core/models/formula.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormulaService } from 'src/app/core/services/formula.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent implements OnInit {
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public editar: boolean = false;
  public formulas: Formula[] = [];
  public formFormula: FormGroup;
  public loading: boolean = false;
  public loadingMin: boolean = false;

  private destruirObservaveis = new Subject<void>();

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: Formula[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Formula>>;
  public dados = {
    id_empresa: this.idEmpresa,
    id_formula: 0,
    user_login: this.login
  }

  constructor(
    private _formula: FormulaService,
    private _fb: FormBuilder,
    private _modal: NgbModal,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.obterFormulas();
    this.inicializarFormFomula();
  }

  public inicializarFormFomula(dado?: FormulaRequest) {
    this.formFormula = this._fb.group({
      id_empresa: [dado?.id_empresa || this.idEmpresa],
      descricao: [dado?.descricao || '', Validators.required],
      usa_indice: [dado?.usa_indice || ''],
      usa_comissao_entrada: [dado?.usa_comissao_entrada || ''],
      usa_adicional: [dado?.usa_adicional || ''],
      fator_adicional: [dado?.fator_adicional || 0],
      multa: [dado?.fator_multa || 0, [Validators.min(0)]],
      juros: [dado?.fator_juros || 0, [Validators.min(0)]],
      taxa: [dado?.fator_taxa || 0, [Validators.min(0)]],
      desconto_principal: [dado?.desconto_principal || 0, [Validators.min(0)]],
      desconto_multa: [dado?.desconto_multa || 0, [Validators.min(0)]],
      desconto_juros: [dado?.desconto_juros || 0, [Validators.min(0)]],
      desconto_taxa: [dado?.desconto_taxa || 0, [Validators.min(0)]],
      desconto_indice: [dado?.desconto_indice || 0, [Validators.min(0)]],
      receita_principal: [dado?.receita_principal || 0, [Validators.min(0)]],
      receita_multa: [dado?.receita_multa || 0, [Validators.min(0)]],
      receita_juros: [dado?.receita_juros || 0, [Validators.min(0)]],
      receita_indice: [dado?.receita_indice || 0, [Validators.min(0)]],
      receita_taxa: [dado?.receita_taxa || 0, [Validators.min(0)]],
      user_login: [dado?.user_login || this.login, Validators.required],
    });

    // Observa mudanças no campo usa_comissao_entrada e reseta fator_adicional se for 'S'
    this.formFormula.get('usa_comissao_entrada')?.valueChanges
      .pipe(takeUntil(this.destruirObservaveis)).subscribe((valor) => {
        if (valor === 'S') {
          this.formFormula.get('fator_adicional')?.setValue(0);
        }
      });
  }

  ngOnDestroy(): void {
    this.destruirObservaveis.next();
    this.destruirObservaveis.complete();
  }

  public obterFormulas() {
    this.loading = true;
    this._formula.listarFormulas(this.dados).subscribe((res) => {
      if (res.success === "true") {
        this.formulas = res.formulas;
        this.filtrar();
        this.atualizarQuantidadeExibida();
        this.loading = false;
      } else {
        this.loading = false;
        this._alert.warning(res.msg);
      }
      (error) => {
        this.loadingMin = false;
        this._alert.error("Ocorreu um error.", error);
      }
    });
  }

  public validarEntrada(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value + event.key);

    if (!/^\d$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }

    if (value < 0 || value > 100) {
      event.preventDefault();
    }
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.formulas, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<Formula>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.formulas;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public controleBotao() {
    if (this.formFormula.invalid) {
      this._funcoes.camposInvalidos(this.formFormula);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if(this.editar == false) {
      this.cadastrarFormula();
    } else {
      this.editarFormula();
    }
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.inicializarFormFomula();
    this.editar = false;
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarFormula() {
    if (this.formFormula.valid) {
      this.loadingMin = true;
      this._formula.cadastrarFormula(this.formFormula.value).subscribe((res) => {
        if(res.success === "true") {
          this.loadingMin = false;
          this.obterFormulas();
          this._alert.success(res.msg);
          this.fechar();
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um erro ao tentar cadastrar o contratante.");
        }
      );
    } else {
      this.loadingMin = false;
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abriModalEditar(content: TemplateRef<any>, dados: FormulaRequest): void {
    this.editar = true;
    this.inicializarFormFomula(dados)
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarFormula() {
    if (this.formFormula.valid) {
      this.loadingMin = true;
      this._formula.editarFormula(this.formFormula.value).subscribe((res) => {
        if(res.success === "true") {
          this.loadingMin = false;
          this.obterFormulas();
          this._alert.success(res.msg);
          this.fechar();
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um erro ao tentar cadastrar o contratante.");
        }
      );
    } else {
      this.loadingMin = false;
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formFormula.reset();
    this._modal.dismissAll();
  }
}
