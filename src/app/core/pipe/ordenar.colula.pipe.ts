import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarPor'
})
export class OrdenarPorPipe implements PipeTransform {
  transform(array: any[], propriedade: string, ordem: 'asc' | 'desc' = 'asc'): any[] {
    if (!array || !propriedade) return array;
    return array.sort((a, b) => {
      let valorA = a[propriedade];
      let valorB = b[propriedade];
      return ordem === 'asc' ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    });
  }
}
