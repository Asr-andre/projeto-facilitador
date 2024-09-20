import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Formula } from 'src/app/core/models/formula.model';
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
  public formFomula: FormGroup;
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
  }

  public obterFormulas() {
    this._formulaService.listarFormulas(this.dados).subscribe((res) => {
      if(res.success === "true") {
        this.formulas = res.formulas;
        this.filtrar();
      this.atualizarQuantidadeExibida();
     } else {
        this.loadingMin = false;
        this._alertService.error(res.msg);
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

    } else {

    }
  }

  public abriModalCadastro(content: TemplateRef<any>): void {

    this.editar = false;
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: Formula): void {

    this.editar = true;
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public fechar() {
    this.formFomula.reset();
    this._modalService.dismissAll();
  }
}
