import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstadosDoBrasil } from 'src/app/core/helpers/estados.brasil';
import { Utils } from 'src/app/core/helpers/utils';
import { EnderecoModel, EnderecoResponseModel } from 'src/app/core/models/endereco.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EnderecoService } from 'src/app/core/services/endereco.service';

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

  constructor(
    private _enderecoService: EnderecoService,
    private _alertService: AlertService,
    private _formBuilder: FormBuilder,
    private _auth: AuthenticationService,
    private _modalService: NgbModal
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
    this.formEndereco = this._formBuilder.group({
      id_cliente: [this.idCliente],
      id_empresa: [this.idEmpresa],
      id_ender: [dado?.id_ender],
      endereco: [dado?.endereco || ""],
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
    console.log(this.editar)
    if(this.editar == false) {
      this.cadastrarEndereco();
    } else {
      this.editarEndereco();
    }
  }

  public obterEnderecos(): void {
    const request = { id_cliente: this.idCliente! };

    this.loadingMin = true;
    this._enderecoService.obterEnderecos(request).subscribe(
      (res: EnderecoResponseModel) => {
        this.enderecos = res.enderecos;
        this.loadingMin = false;
      },
      (error) => {
        this.loadingMin = false;
        this._alertService.error('Erro ao buscar endereços.');

      }
    );
  }

  public abriModalTelefone(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarFormEndereco();
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: EnderecoModel): void {
    this.editar = true;
    this.inicializarFormEndereco(dados);
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarEndereco(): void {
    if (this.formEndereco.valid) {
      this.loadingMin = true;
      this._enderecoService.cadastrarEndereco(this.formEndereco.value).subscribe((res) => {
        if (res.success === 'true') {
          this.obterEnderecos();
         this.fechar();
          this._alertService.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Ocorreu um erro ao tentar cadastrar o endereço.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public editarEndereco(): void {
    if (this.formEndereco.valid) {
      this.loadingMin = true;
      this._enderecoService.editarEndereco(this.formEndereco.value).subscribe((res) => {
        if (res.success === 'true') {
          this.obterEnderecos();
         this.fechar();
          this._alertService.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Ocorreu um erro ao tentar editar o endereço.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public mascararCep(cep: string): string {
    if (cep) {
      return Utils.formatarCEP(cep);
    }
    return cep;
  }

  public fechar() {
    this.formEndereco.reset();
    this._modalService.dismissAll();
  }
}
