import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarCpf'
})
export class FormatarCpfPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}

//<p>{{ '12345678909' | formatarCpf }}</p>  Saída: 123.456.789-09
