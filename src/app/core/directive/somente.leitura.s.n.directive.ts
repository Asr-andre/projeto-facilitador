import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appLeitura]'
})
export class SomenteLeituraDirective implements OnChanges {
  @Input('appLeitura') campoSomenteLeitura: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campoSomenteLeitura']) {
      this.toggleReadonly();
    }
  }

  private toggleReadonly() {
    const element = this.el.nativeElement;
    const isReadonly = this.campoSomenteLeitura !== 'S';

    if (isReadonly) {
      this.renderer.setAttribute(element, 'readonly', 'true');
      this.renderer.setStyle(element, 'background-color', '#cccccc66'); // Cinza claro
      this.renderer.setStyle(element, 'color', '#666'); // Texto acinzentado
      this.renderer.setStyle(element, 'cursor', 'not-allowed'); // Cursor bloqueado
    } else {
      this.renderer.removeAttribute(element, 'readonly');
      this.renderer.removeStyle(element, 'background-color');
      this.renderer.removeStyle(element, 'color');
      this.renderer.removeStyle(element, 'cursor');
    }
  }
}
