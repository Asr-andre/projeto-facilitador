import { Validators } from '@angular/forms';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstadosDoBrasil } from 'src/app/core/helpers/estados.brasil';
import { EnderecoModel, EnderecoResponseModel } from 'src/app/core/models/endereco.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EnderecoService } from 'src/app/core/services/endereco.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.scss'
})
export class EnderecoComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  public loadingMin: boolean = false;
  public enderecos: EnderecoModel[] = [];
  public formEndereco: FormGroup;
  public login = this._auth.getLogin();
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public editar: boolean = false;
  public estados = EstadosDoBrasil;
  public conteudoCompleto: string;

  constructor(
    private _endereco: EnderecoService,
    private _alert: AlertService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _modal: NgbModal,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.obterEnderecos();
    this.inicializarFormEndereco();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.obterEnderecos();
    }
  }

  public inicializarFormEndereco(dado?: EnderecoModel) {
    this.formEndereco = this._fb.group({
      id_cliente: [this.idCliente],
      id_empresa: [this.idEmpresa],
      id_ender: [dado?.id_ender],
      endereco: [dado?.endereco || "", Validators.required],
      numero: [dado?.numero || ""],
      complemento: [dado?.complemento || ""],
      bairro: [dado?.bairro || ""],
      cidade: [dado?.cidade || ""],
      uf: [dado?.uf || ""],
      cep: [dado?.cep || ""],
      tipo: [dado?.tipo || ""],
      origem: [dado?.origem || "Cadastro"],
      situacao: [dado?.situacao || ""],
      user_login: [this.login]
    });
  }

  public controleBotao() {
    if (this.formEndereco.invalid) {
      this._funcoes.camposInvalidos(this.formEndereco);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if(this.editar == false) {
      this.cadastrarEndereco();
    } else {
      this.editarEndereco();
    }
  }

  public obterEnderecos(): void {
    if (!this.idCliente) return;

    const request = { id_cliente: this.idCliente! };

    this.loadingMin = true;
    this._endereco.obterEnderecos(request).subscribe(
      (res: EnderecoResponseModel) => {
        this.enderecos = res.enderecos;
        this.loadingMin = false;
      },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Erro ao buscar endereços.');

      }
    );
  }

  public abriModalTelefone(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarFormEndereco();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: EnderecoModel): void {
    this.editar = true;
    this.inicializarFormEndereco(dados);
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarEndereco(): void {
    if (this.formEndereco.valid) {
      this.loadingMin = true;
      this._endereco.cadastrarEndereco(this.formEndereco.value).subscribe((res) => {
        if (res.success === 'true') {
          this.obterEnderecos();
         this.fechar();
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar cadastrar o endereço.');
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public editarEndereco(): void {
    if (this.formEndereco.valid) {
      this.loadingMin = true;
      this._endereco.editarEndereco(this.formEndereco.value).subscribe((res) => {
        if (res.success === 'true') {
          this.obterEnderecos();
         this.fechar();
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar editar o endereço.');
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formEndereco.reset();
    this._modal.dismissAll();
  }
}
