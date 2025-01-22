import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSomenteLeitura]'
})
export class DeixaSomenteLeituraDirective implements OnChanges {
  @Input('appSomenteLeitura') somenteLeitura: boolean; // A condição para tornar o campo somente leitura

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['somenteLeitura']) {
      this.toggleReadonly();
    }
  }

  private toggleReadonly() {
    if (this.somenteLeitura) {
      // Torna o input somente leitura
      this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'true');

      // Adiciona a cor de fundo para somente leitura
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#f0f0f0'); // Cor mais visível
      this.renderer.setStyle(this.el.nativeElement, 'color', '#666'); // Cor do texto (opcional, para dar contraste)
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed'); // Modifica o cursor para mostrar que não pode ser editado
    } else {
      // Remove a propriedade somente leitura
      this.renderer.removeAttribute(this.el.nativeElement, 'readonly');

      // Remove a cor de fundo
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
      this.renderer.removeStyle(this.el.nativeElement, 'color');
      this.renderer.removeStyle(this.el.nativeElement, 'cursor');
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
