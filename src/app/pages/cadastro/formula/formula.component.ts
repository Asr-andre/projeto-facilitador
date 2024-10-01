import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Formula, FormulaRequest } from 'src/app/core/models/formula.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FormulaService } from 'src/app/core/services/formula.service';

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
    private _formulaService: FormulaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _auth: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.obterFormulas();
    this.inicializarFormFomula();
  }

  public inicializarFormFomula(dado?: FormulaRequest) {
    this.formFormula = this._formBuilder.group({
      id_empresa: [dado?.id_empresa || this.idEmpresa],
      descricao: [dado?.descricao || '', Validators.required],
      multa: [dado?.multa || 0, [Validators.min(0)]],
      juros: [dado?.juros || 0, [Validators.min(0)]],
      taxa: [dado?.taxa || 0, [Validators.min(0)]],
      desconto_principal: [dado?.desconto_principal || 0, [Validators.min(0)]],
      desconto_multa: [dado?.desconto_multa || 0, [Validators.min(0)]],
      desconto_juros: [dado?.desconto_juros || 0, [Validators.min(0)]],
      desconto_taxa: [dado?.desconto_taxa || 0, [Validators.min(0)]],
      user_login: [dado?.user_login || this.login, Validators.required],
    });
  }

  public obterFormulas() {
    this.loading = true;
    this._formulaService.listarFormulas(this.dados).subscribe((res) => {
      if (res.success === "true") {
        this.formulas = res.formulas;
        this.filtrar();
        this.atualizarQuantidadeExibida();
        this.loading = false;
      } else {
        this.loading = false;
        this._alertService.warning(res.msg);
      }
      (error) => {
        this.loadingMin = false;
        this._alertService.error("Ocorreu um error.", error);
      }
    });
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
    if(this.editar == false) {
      this.cadastrarFormula();
    } else {
      this.editarFormula();
    }
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this.inicializarFormFomula();
    this.editar = false;
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarFormula() {
    if (this.formFormula.valid) {
      this.loadingMin = true;
      this._formulaService.cadastrarFormula(this.formFormula.value).subscribe((res) => {
        if(res.success === "true") {
          this.loadingMin = false;
          this.obterFormulas();
          this._alertService.success(res.msg);
          this.fechar();
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar cadastrar o contratante.");
        }
      );
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abriModalEditar(content: TemplateRef<any>, formula: any): void {
    this.editar = true;
    this.formFormula.patchValue({
      id_empresa: this.idEmpresa,
      descricao: formula.descricao,
      multa: formula.fator_multa,
      juros: formula.fator_juros,
      taxa: formula.fator_taxa,
      desconto_principal: formula.desconto_principal,
      desconto_multa: formula.desconto_multa,
      desconto_juros: formula.desconto_juros,
      desconto_taxa: formula.desconto_taxa,
      user_login: this.login,
    });

    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarFormula() {
    if (this.formFormula.valid) {
      this.loadingMin = true;
      this._formulaService.editarFormula(this.formFormula.value).subscribe((res) => {
        if(res.success === "true") {
          this.loadingMin = false;
          this.obterFormulas();
          this._alertService.success(res.msg);
          this.fechar();
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar cadastrar o contratante.");
        }
      );
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formFormula.reset();
    this._modalService.dismissAll();
  }

  public data(data) {
    if(data) {
      return Utils.formatarDataParaExibicao(data);
    }
  }

  public verificarValorNegativo(campo: string) {
    const valor = this.formFormula.get(campo)?.value;

    if (valor <= 0) {
      this.formFormula.get(campo)?.setValue(0);
    }
  }
}
