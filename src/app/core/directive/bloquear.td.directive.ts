import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[limitarCaracteres]',
})
export class LimitarCaracteresDirective {
  @Input('limitarCaracteres') maxCaracteres!: number;

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    const target = event.target as HTMLElement;
    if (target.textContent && target.textContent.length > this.maxCaracteres) {
      target.textContent = target.textContent.substring(0, this.maxCaracteres);
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
}
