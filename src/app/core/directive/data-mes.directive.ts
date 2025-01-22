import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDataMes]'
})
export class DataMesDirective implements OnInit {
  @Input('appDataMes') tipoData: 'inicio' | 'fim' | 'hoje';

  constructor(private el: ElementRef, private renderer: Renderer2, private control: NgControl) {}

  ngOnInit() {
    this.definirData();
  }

  private definirData() {
    let dataFormatada = '';

    if (this.tipoData === 'inicio') {
      dataFormatada = this.primeiroDiaMes();
    } else if (this.tipoData === 'fim') {
      dataFormatada = this.ultimoDiaMes();
    } else if (this.tipoData === 'hoje') {
      dataFormatada = this.dataAtual();
    }

    // Definir valor no input e atualizar controle do formulário
    this.renderer.setProperty(this.el.nativeElement, 'value', dataFormatada);
    if (this.control.control) {
      this.control.control.setValue(dataFormatada);
    }
  }

  private primeiroDiaMes(): string {
    const data = new Date();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    return `${ano}-${mes <= 9 ? '0' + mes : mes}-01`;
  }

  private ultimoDiaMes(): string {
    const today = new Date();
    const primeiroDiaProximoMes = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    primeiroDiaProximoMes.setDate(primeiroDiaProximoMes.getDate() - 1);
    return primeiroDiaProximoMes.toISOString().split('T')[0];
  }

  private dataAtual(): string {
    const today = new Date();
    const dia = today.getDate();
    const mes = today.getMonth() + 1;
    const ano = today.getFullYear();
    return `${ano}-${mes <= 9 ? '0' + mes : mes}-${dia <= 9 ? '0' + dia : dia}`;
  }
}
