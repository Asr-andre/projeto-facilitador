import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rg'
})
export class RgPipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) {
      return '';
    }

    // Remove tudo que não é número
    const rgLimpo = value.toString().replace(/\D/g, '');

    if (rgLimpo.length === 9) {
      // Formato com dígito: 12.345.678-9
      return rgLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
    } else if (rgLimpo.length === 8) {
      // Formato sem dígito: 12.345.678
      return rgLimpo.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
    }

    // Se não for 8 ou 9 dígitos, retorna o valor original
    return value.toString();
  }
}
