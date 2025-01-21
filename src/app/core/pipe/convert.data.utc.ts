import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataBr'
})
export class DataBrPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const data = new Date(value);
    data.setHours(data.getHours() + 4); // Ajustando fuso para Brasília (GMT-3)
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}

//<p>{{ '2024-07-28T12:00:00Z' | dataBr }}</p> Saída: 28/07/2024
