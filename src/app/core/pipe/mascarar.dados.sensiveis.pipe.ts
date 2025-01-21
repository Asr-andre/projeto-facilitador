import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascararTexto'
})
export class MascararTextoPipe implements PipeTransform {
  transform(value: string, start: number = 2, end: number = 2): string {
    if (!value) return '';
    const masked = value.substring(0, start) + '*'.repeat(value.length - start - end) + value.slice(-end);
    return masked;
  }
}

//<p>{{ '12345678900' | mascararTexto:3:2 }}</p>
//<!-- Saída: 123*******00 -->
