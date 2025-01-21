import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[focoProximoCampo]'
})
export class FocoProximoCampoDirective {
  @Input('focoProximoCampo') maxLength!: number;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput() {
    if (this.el.nativeElement.value.length >= this.maxLength) {
      let nextElement = this.el.nativeElement.nextElementSibling;
      if (nextElement && nextElement.tagName === 'INPUT') {
        nextElement.focus();
      }
    }
  }
}

//<input type="text" focoProximoCampo="3" maxlength="3" />
//<input type="text" focoProximoCampo="3" maxlength="3" />
//<input type="text" focoProximoCampo="3" maxlength="3" />
