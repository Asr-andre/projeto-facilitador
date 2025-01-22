import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AcionamentoAnaliticoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/relatorio/acionamento.model';
import { AlertService } from 'src/app/core/services/alert.service';;
import { ExcelService } from 'src/app/core/services/excel.service';
import { AcionamentoService } from 'src/app/core/services/relatorio/acionamento.service';

@Component({
  selector: 'app-analitico',
  templateUrl: './analitico.component.html',
  styleUrl: './analitico.component.scss'
})

export class AnaliticoComponent implements OnChanges {
  @Input() filtros: RequisicaoAcionamentoModel;
  public loadingMin: boolean = false;
  public acio_Analitico: AcionamentoAnaliticoModel[] = [];

  constructor(
    private _acionamento: AcionamentoService,
    private _alert: AlertService,
    private _datePipe: DatePipe,
    private _excel: ExcelService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.acionamentosAnalitico();
    }
  }

  public acionamentosAnalitico() {
    const dadosParaEnvio = { ...this.filtros };
    dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy");
    dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy");

    this.loadingMin = true;
    this._acionamento.obterAcionamentosAnalitico(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loadingMin = false;
        if (res.success === 'true') {
          this.acio_Analitico = res.dados;

          this.acio_Analitico.sort((a, b) => {
            if (a.data_acio < b.data_acio) return 1;
            if (a.data_acio > b.data_acio) return -1;
            return 0;
          });

          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
        (error) => {
          this.loadingMin = false;
          this._alert.error("Ocorreu um error.", error);
        }
      }
    });
  }

  public exportExcel() {
    this._excel.exportAsExcelFile(this.acio_Analitico, 'exportacaoAcionamentoAnalitico');
  }
}


