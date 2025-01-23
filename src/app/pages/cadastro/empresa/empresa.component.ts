import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetornoModel } from 'src/app/core/models/retorno.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

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
    private _fb: FormBuilder,
    private _empresa: EmpresaService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit() {
    this.inicializarformEmpresa();
  }

  inicializarformEmpresa() {
    this.formEmpresa = this._fb.group({
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
      email: ['',Validators.required],
      celular: [''],
      nome_responsavel: [''],
      user_login: [this._auth.getLogin()],
    });
  }

  public cadastrarEmpresa() {
    this._funcoes.camposInvalidos(this.formEmpresa);

    if (this.formEmpresa.valid) {
      this._empresa.cadastrarEmpresa(this.formEmpresa.value).subscribe((res: RetornoModel) => {
        if (res && res.success === 'true') {
          this._alert.success(res.msg);
          this.idEmpresaEmit.emit(res.id_empresa);
          this.siglaEmit.emit(res.sigla);
          this.idEmpresa = res.id_empresa;
          this.sigla = res.sigla;
        } else {
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this._alert.error("Ocorreu um error ao tentar cadastrar a empresa.");
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }
}
