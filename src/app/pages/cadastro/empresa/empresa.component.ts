import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetornoModel } from 'src/app/core/models/retorno.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit {
  @Output() idEmpresaEmit = new EventEmitter<string>();
  @Output() siglaEmit = new EventEmitter<string>();
  public idEmpresa: string;
  public sigla: string
  public formEmpresa: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _empresaService: EmpresaService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.inicializarformEmpresa();
  }

  inicializarformEmpresa() {
    this.formEmpresa = this._formBuilder.group({
      razao_social: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      fantasia: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
      cnpj: ['', Validators.required],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
      site: [''],
      email: ['',Validators.email],
      celular: [''],
      nome_responsavel: [''],
      user_login: [this._authenticationService.getLogin()],
    });
  }

  public somenteTexto(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  public cadastrarEmpresa() {
    if (this.formEmpresa.valid) {
      this._empresaService.cadastrarEmpresa(this.formEmpresa.value).subscribe((res: RetornoModel) => {
          if (res && res.success === 'true') {
            this._alertService.success(res.msg);
            this.idEmpresaEmit.emit(res.id_empresa);
            this.siglaEmit.emit(res.sigla);
            this.idEmpresa = res.id_empresa;
            this.sigla = res.sigla;
          } else {
            this._alertService.warning(res.msg);
          }
        },
        (error) => {
          this._alertService.error('Ocorreu um erro ao tentar cadastrar a empresa.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }
}
