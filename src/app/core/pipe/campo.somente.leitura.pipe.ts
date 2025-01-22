import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSomenteLeitura]'
})
export class SomenteLeituraDirective implements OnChanges {
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
    } else {
      // Remove a propriedade somente leitura
      this.renderer.removeAttribute(this.el.nativeElement, 'readonly');
    }
  }
}

//como usar

// isSomenteLeitura: boolean = true; // Condição que controla o estado de somente leitura

//<!-- Com a condição "true", o campo será somente leitura -->
//<input [appSomenteLeitura]="isSomenteLeitura" type="text" placeholder="Digite algo...">
