import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-prestacao-contas',
  templateUrl: './prestacao-contas.component.html',
  styleUrl: './prestacao-contas.component.scss'
})
export class PrestacaoContasComponent implements OnInit, OnChanges  {
  @Input() filtros: any;
  public loadingMin: boolean = false;
  public textoPesquisa: string = "";

  registros = [
    { cpf: '46419730325', nomeCliente: 'PEDRO SOUZA AMARAL', vencimento: '09/07/2024', dtPago: '06/01/2024', parcPla: '01/12', valorPrincipal: 525.00, valorPago: 600.00, comissao: 75.00, repasse: 525.00 },
    { cpf: '46419730325', nomeCliente: 'PEDRO SOUZA AMARAL', vencimento: '09/07/2024', dtPago: '06/01/2024', parcPla: '02/12', valorPrincipal: 525.00, valorPago: 590.00, comissao: 65.00, repasse: 525.00 },
    { cpf: '12314569874', nomeCliente: 'André da Silva Botelho Júnior', vencimento: '09/01/2023', dtPago: '06/01/2024', parcPla: '01/01', valorPrincipal: 80.00, valorPago: 100.00, comissao: 20.00, repasse: 80.00 }
  ];

  constructor(
      private _auth: AuthenticationService,
      private _datePipe: DatePipe,
      private _alertService: AlertService,
      private _excelService: ExcelService,
      private _modalService: NgbModal

    ) { }

  ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['filtros'] && this.filtros) {
      }
    }

    get totalPrincipal() {
      return this.registros.reduce((total, registro) => total + registro.valorPrincipal, 0);
    }

    get totalPago() {
      return this.registros.reduce((total, registro) => total + registro.valorPago, 0);
    }

    get totalComissao() {
      return this.registros.reduce((total, registro) => total + registro.comissao, 0);
    }

    get totalRepasse() {
      return this.registros.reduce((total, registro) => total + registro.repasse, 0);
    }

    public gerarPDF(): void {
      // Seleciona o elemento HTML que você quer converter em PDF
      const elemento = document.getElementById('conteudoPDF');

      if (elemento) {
        html2canvas(elemento).then((canvas) => {
          const imagemData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');

          // Ajusta a imagem ao tamanho do PDF
          const larguraPDF = pdf.internal.pageSize.getWidth();
          const alturaPDF = (canvas.height * larguraPDF) / canvas.width;

          pdf.addImage(imagemData, 'PNG', 0, 0, larguraPDF, alturaPDF);
          pdf.save('detalhamento_geral.pdf'); // Nome do arquivo gerado
        });
      } else {
        console.error('Elemento não encontrado!');
      }
    }

    public abrirModalRelatorio(content: TemplateRef<any>): void {

        this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }

    public exportExcel() {

    }

    public filtrar(): void {

      }

    public fechar() {
      this._modalService.dismissAll();
    }

}
