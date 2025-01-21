import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[mostrarSenha]'
})
export class MostrarSenhaDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.type = 'text';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.type = 'password';
  }
}

//<input type="password" mostrarSenha placeholder="Passe o mouse para ver" />
