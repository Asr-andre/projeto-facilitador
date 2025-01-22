import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSomenteLeitura]' // Aplica a diretiva a qualquer elemento que use "appSomenteLeitura"
})
export class DeixaSomenteLeituraDirective implements OnChanges {
  @Input('appSomenteLeitura') somenteLeitura: boolean; // A condição para tornar o campo somente leitura

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    // Quando a condição de somente leitura mudar, aplicamos ou removemos os estilos
    if (changes['somenteLeitura']) {
      this.toggleReadonly();
    }
  }

  private toggleReadonly() {
    const element = this.el.nativeElement;

    // Aplicando a condição de somente leitura para vários tipos de campos (input, select, etc)
    if (this.somenteLeitura) {
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        this.renderer.setAttribute(element, 'readonly', 'true');
        this.renderer.setStyle(element, 'background-color', '#cccccc66'); // Cor de fundo para indicar somente leitura
        this.renderer.setStyle(element, 'color', '#666'); // Cor do texto para indicar que é somente leitura
        this.renderer.setStyle(element, 'cursor', 'not-allowed'); // Cursor de "não permitido"
      }
    } else {
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        this.renderer.removeAttribute(element, 'readonly');
        this.renderer.removeStyle(element, 'background-color');
        this.renderer.removeStyle(element, 'color');
        this.renderer.removeStyle(element, 'cursor');
      }
    }
  }
}


//como usar

// isSomenteLeitura: boolean = true; // Condição que controla o estado de somente leitura

//<!-- Com a condição "true", o campo será somente leitura -->
//<input [appSomenteLeitura]="isSomenteLeitura" type="text" placeholder="Digite algo...">


///* Estilo para campos somente leitura */
//input[readonly] {
//  background-color: #e7e3e3 !important;  /* Cor de fundo */
//  border: 1px solid #ccc;  /* Borda opcional */
//}
