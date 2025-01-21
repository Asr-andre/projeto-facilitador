import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simNao'
})
export class SimNaoPipe implements PipeTransform {
  transform(value: string): string {
    return value === 'S' ? 'Sim' : 'Não';
  }
}
