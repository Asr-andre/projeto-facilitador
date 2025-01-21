import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[clickCor]'
})
export class ClickCorDirective {
  @Input('clickCor') cor: string = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    this.el.nativeElement.style.backgroundColor = this.cor;
  }
}

//<button clickCor="lightgreen">Clique para mudar a cor</button>
