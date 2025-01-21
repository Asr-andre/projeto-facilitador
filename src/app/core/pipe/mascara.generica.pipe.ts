import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascara'
})
export class MascaraPipe implements PipeTransform {
  transform(value: string, mascara: string): string {
    if (!value) return '';
    let i = 0;
    return mascara.replace(/#/g, () => value[i++] || '');
  }
}

//* exemplo
//<p>{{ '12345678909' | mascara:'###.###.###-##' }}</p>  Saída: 123.456.789-09
//<p>{{ '12345678000195' | mascara:'##.###.###/####-##' }}</p> Saída: 12.345.678/0001-95
//<p>{{ '12345678' | mascara:'#####-###' }}</p>Saída: 12345-678
