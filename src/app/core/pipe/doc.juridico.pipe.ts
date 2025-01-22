import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docJuridico'
})
export class DocJuridicoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return ''; // Se não houver valor, retorna vazio

    // Ajusta a expressão regular para o formato desejado
    const regex = /^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/;
    const match = value.replace(/\D/g, '').match(regex); // Remove caracteres não numéricos e aplica o regex

    if (match) {
      // Retorna o número formatado conforme o padrão
      return `${match[1]}-${match[2]}.${match[3]}.${match[4]}.${match[5]}.${match[6]}`;
    }

    return value; // Retorna o valor original se não combinar com o formato
  }
}


//Ex: 0000000-00.0000.0.00.0000
