import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lgpd'
})
export class MascararCpfLgpdPipe implements PipeTransform {
  transform(value: string, visivel: number = 4): string {
    if (!value) return '';
    const oculto = '*'.repeat(value.length - visivel);
    return oculto + value.slice(-visivel);
  }
}
