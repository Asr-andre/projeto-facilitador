import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tituloComposto'
})
export class TituloCompostoPipe implements PipeTransform {
  private excecoes = ['de', 'da', 'do', 'dos', 'das', 'e', 'em', 'com', 'a', 'o'];

  transform(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map((word, index) => this.excecoes.includes(word) && index !== 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
