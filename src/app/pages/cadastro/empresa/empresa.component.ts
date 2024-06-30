import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetornoModel } from 'src/app/core/models/retorno.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmpresaService } from 'src/app/core/services/empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit {
  @Output() idEmpresaEmit = new EventEmitter<string>();
  idEmpresa: string;
  public formEmpresa: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _empresaService: EmpresaService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.inicializarformMembro();
  }

  inicializarformMembro() {
    this.formEmpresa = this._formBuilder.group({
      razao_social: ['', Validators.required],
      fantasia: ['', Validators.required],
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

  public cadastrarEmpresa() {
    if (this.formEmpresa.valid) {
      console.log(this.formEmpresa.value);
      this._empresaService.cadastrar(this.formEmpresa.value).subscribe(
        (res: RetornoModel) => {
          if (res && res.success === 'true') {
            this._alertService.success(res.msg);
            this.idEmpresaEmit.emit(res.id_empresa);
            this.idEmpresa = res.id_empresa;
          } else {
            this._alertService.warning(res.msg);
          }
        },
        (error) => {
          this._alertService.error('Ocorreu um erro ao tentar cadastrar a empresa.');
          console.error(error);
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }
}
