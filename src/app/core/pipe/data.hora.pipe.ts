import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataHoraBrasileira'
})
export class DataHoraBrasileiraPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const data = new Date(value);

    // Formatação da data no formato dd/mm/yyyy
    const dataFormatada = data.toLocaleDateString('pt-BR');

    // Formatação da hora no formato hh:mm (sem ajuste de fuso horário)
    const horaFormatada = data.getUTCHours().toString().padStart(2, '0') + ':' +
                          data.getUTCMinutes().toString().padStart(2, '0');

    return `${dataFormatada} ${horaFormatada}`;
  }
}




//<p>{{ '2025-01-21T14:30:00' | dataHoraBrasileira }}</p>
//<!-- Saída: 21/01/2025 14:30:00 -->
