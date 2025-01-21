import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contémPalavra'
})
export class ContemPalavraPipe implements PipeTransform {
  transform(value: string, palavra: string): boolean {
    if (!value || !palavra) return false;
    return value.toLowerCase().includes(palavra.toLowerCase());
  }
}

//<p *ngIf="'Texto de exemplo' | contémPalavra:'exemplo'">A palavra está presente!</p>
//<!-- Exibe o texto se a palavra 'exemplo' estiver presente -->
