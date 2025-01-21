import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[permissao]'
})
export class PermissaoDirective {
  @Input() permissao!: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this.permissao) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}

//<button [permissao]="usuarioAdmin">Apenas para admins</button>
