import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/core/helpers/utils';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { RetornoModel } from 'src/app/core/models/retorno.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';

@Component({
  selector: 'app-contratantes',
  templateUrl: './contratantes.component.html',
  styleUrl: './contratantes.component.scss'
})
export class ContratantesComponent implements OnInit {
  public contratantes: ContratanteModel[];
  public idEmpresa: number;
  public formContratante: FormGroup;
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public paginaAtual: number = 1;
  public itensPorPagina: number = 20;

  constructor(
    private _contratanteService: ContratanteService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.idEmpresa = Number(this._authenticationService.getIdEmpresa());
    this.obterContratantes(this.idEmpresa);
    this.inicializarformContratante();
  }

  public inicializarformContratante() {
    this.formContratante = this._formBuilder.group({
      id_empresa: [this._authenticationService.getIdEmpresa()],
      cnpj: ["", Validators.required],
      razao_social: ["", Validators.required],
      fantasia: ["", Validators.required],
      cep: [""],
      endereco: [""],
      numero: [""],
      complemento: [""],
      bairro: [""],
      cidade: [""],
      uf: [""],
      user_login: [this._authenticationService.getLogin()],
    });
  }

  public obterContratantes(idEmpresa: number) {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alertService.error('Ocorreu um erro ao obter os contratantes.');
        this.loading = false;
      }
    );
  }

  public abriModalCadastro(content: TemplateRef<any>): void {
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public cadastrarContratante(){
    if (this.formContratante.valid) {
      this.loadingMin = true;
      this._contratanteService.cadastrarContratante(this.formContratante.value).subscribe((res: RetornoModel) => {
        if (res && res.success === "true") {
          this.loadingMin = false;
          this.obterContratantes(this.idEmpresa);
          this._alertService.success(res.msg);
          this._modalService.dismissAll();
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error("Ocorreu um erro ao tentar cadastrar a empresa.");
        }
      );
    } else {
      this.loadingMin = false;
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public mascararCep(cep: string): string {
    if (cep) {
      return Utils.formatarCEP(cep);
    }
    return cep;
  }

  public mascararNResidencia(numero: string): string {
    if (numero) {
      return Utils.formatarNumeroResidencia(numero);
    }
    return numero;
  }
}
