import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/core/helpers/utils';
import { SimuladorPadraoService } from 'src/app/core/services/simulador.padrao.sevice';
import { RecalculoRetornoModel } from 'src/app/core/models/simulador.padrao.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-simulador-padrao',
  templateUrl: './simulador-padrao.component.html',
  styleUrls: ['./simulador-padrao.component.scss']
})
export class SimuladorPadraoComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate: any;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  private modalRef: NgbModalRef;
  public descontoMaximo: any;
  public data: any;
  public form: FormGroup;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login = this._authService.getLogin();

  public totalJuros: number = 0;
  public totalMulta: number = 0;
  public totalTaxa: number = 0;
  public totalGeral: number = 0;
  public totalValor: number = 0;

  public originalPrincipal: number = 0;
  public originalMulta: number = 0;
  public originalJuros: number = 0;
  public originalTaxa: number = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private simuladorService: SimuladorPadraoService,
    private _authService: AuthenticationService,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [this.idContratante],
      id_cliente: [this.idCliente],
      desconto_principal: ['', Validators.min(0)],
      desconto_multa: ['', Validators.min(0)],
      desconto_juros: ['', Validators.min(0)],
      desconto_taxa: ['', Validators.min(0)],
      data_atualizacao: [''],
      titulos: [''],
      user_login: [this.login],
    });
  }

  ngOnInit(): void {}

  public abrirModalSimulado(data: any): void {
    this.data = data;

    this.originalPrincipal = data.desconto_principal;
    this.originalMulta = data.desconto_multa;
    this.originalJuros = data.desconto_juros;
    this.originalTaxa = data.desconto_taxa;

    const dataAtualizacao = data.data_atualizacao
    ? this.datePipe.transform(data.data_atualizacao, 'yyyy-MM-dd')
    : this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.form.patchValue({
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante,
      id_cliente: this.idCliente,
      desconto_principal: data.desconto_principal,
      desconto_multa: data.desconto_multa,
      desconto_juros: data.desconto_juros,
      desconto_taxa: data.desconto_taxa,
      data_atualizacao: dataAtualizacao,
      titulos: data.titulos.map(titulo => titulo.id_titulo).join(','),
      user_login: data.user_login,
    });
    this.calcularTotais();
    this.modalRef = this.modalService.open(this.modalTemplate, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }


  public fechar(): void {
    this.modalRef.close();
  }

  public recalcular(): void {
    const dadosParaEnvio = { ...this.form.value };

  // Formatar a data para yyyy-MM-dd
  dadosParaEnvio.data_atualizacao = this.datePipe.transform(dadosParaEnvio.data_atualizacao, 'dd/MM/yyyy');

    this.simuladorService.recalcularNegociacao(dadosParaEnvio).subscribe((response: RecalculoRetornoModel) => {
      this.data = response;
      this.calcularTotais();
    }, error => {
      console.error('Erro ao recalcular:', error);
    });
  }

  private calcularTotais(): void {
    this.totalValor = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor, 0);
    this.totalJuros = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_juros, 0);
    this.totalMulta = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_multa, 0);
    this.totalTaxa = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_taxa, 0);
    this.totalGeral = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_atualizado, 0);
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  /*
  public vencidos(vencimento: string): boolean {
    const hoje = new Date();
    const dataVencimento = new Date(vencimento);
    return dataVencimento > hoje;
  }

  public formatarAtraso(atraso: number, vencido: boolean): string {
    return vencido ? `-${atraso}` : atraso.toString();
  }
    */

}
