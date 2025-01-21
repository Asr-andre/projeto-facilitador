import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitarTexto'
})
export class LimitarTextoPipe implements PipeTransform {
  transform(value: string, limite: number = 20): string {
    if (!value) return '';
    return value.length > limite ? value.substring(0, limite) + '...' : value;
  }
}

//<p>{{ 'Este é um texto muito longo para exibição' | limitarTexto:15 }}</p>
//<!-- Saída: Este é um texto... -->
