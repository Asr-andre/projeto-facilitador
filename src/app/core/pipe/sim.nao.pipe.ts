import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simNao'
})
export class SimNaoPipe implements PipeTransform {
  transform(value: string | boolean | null | undefined): string {
    if (value === 'S' || value === true) {
      return 'Sim';
    }
    return 'Não';
  }
}
