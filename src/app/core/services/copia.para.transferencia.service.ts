import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  public copyToClipboard(value: string): void {
    // Criar um elemento input temporário
    const inputElement = document.createElement('input');
    inputElement.value = value;

    // Adiciona ao body (invisível)
    document.body.appendChild(inputElement);

    // Seleciona e copia o conteúdo
    inputElement.select();
    document.execCommand('copy');

    // Remove o elemento temporário
    document.body.removeChild(inputElement);

    // Exibe um feedback (opcional)
    console.log('Texto copiado:', value);
  }
}
