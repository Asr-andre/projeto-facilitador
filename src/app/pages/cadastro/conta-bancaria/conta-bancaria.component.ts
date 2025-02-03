import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenarPeloHeaderTabela } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-conta-bancaria',
  templateUrl: './conta-bancaria.component.html',
  styleUrl: './conta-bancaria.component.scss'
})
export class ContaBancariaComponent implements OnInit {
  public contaBancariaForm: FormGroup;
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public login = this._auth.getLogin();
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public editar: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: any[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<any>>;

  constructor(
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal,
    private _fb: FormBuilder,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
  }

  public inicializarForm(dado?: any) {
    this.contaBancariaForm = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],

      user_login: [this.login, Validators.required]
    });
  }

  public controleBotao() {
    if (this.contaBancariaForm.invalid) {
      this._funcoes.camposInvalidos(this.contaBancariaForm);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const metodo = this.editar ? this.editarconta() : this.cadastrarConta();

  }

  public modalCadastrar(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarForm();
    this._modal.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }


  public modalEditar(content: TemplateRef<any>, dado: any): void {
    this.editar = true;
    this.inicializarForm(dado)
    this._modal.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarConta() {

  }

  public editarconta() {

  }

  public fechar() {
    this._modal.dismissAll();
  }
}
