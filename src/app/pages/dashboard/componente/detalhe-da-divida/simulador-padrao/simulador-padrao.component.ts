import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utils } from 'src/app/core/helpers/utils';
import { SimuladorPadraoService } from 'src/app/core/services/simulador.padrao.sevice';

@Component({
  selector: 'app-simulador-padrao',
  templateUrl: './simulador-padrao.component.html',
  styleUrls: ['./simulador-padrao.component.scss']
})
export class SimuladorPadraoComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate: any;
  private modalRef: NgbModalRef;
  public data: any;
  public form: FormGroup;

  public totalJuros: number = 0;
  public totalMulta: number = 0;
  public totalTaxa: number = 0;
  public totalGeral: number = 0;
  public totalValor: number = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private simuladorService: SimuladorPadraoService) {
    this.form = this.fb.group({
      descontoPrincipal: [''],
      descontoMulta: [''],
      descontoJuros: [''],
      descontoTaxa: [''],
      dataNova: ['']
    });
  }

  ngOnInit(): void {}

  public abrirModalSimulado(data: any): void {
    this.data = data;
    this.calcularTotais();
    this.modalRef = this.modalService.open(this.modalTemplate, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public fechar(): void {
    this.modalRef.close();
  }

  public recalcular(): void {
    const novaData = this.form.value.dataNova;
    console.log('Nova Data:', novaData);
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
