import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[bloquearCopiarColar]'
})
export class BloquearCopiarColarDirective {
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  @HostListener('copy', ['$event']) onCopy(event: ClipboardEvent) {
    event.preventDefault();
  }
}

//<input type="text" bloquearCopiarColar placeholder="Copiar e colar desativados" />
