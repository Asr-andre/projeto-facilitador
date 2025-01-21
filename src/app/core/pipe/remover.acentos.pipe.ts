import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removerAcentos'
})
export class RemoverAcentosPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
