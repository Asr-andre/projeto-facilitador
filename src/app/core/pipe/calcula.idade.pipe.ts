import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularIdade'
})
export class CalcularIdadePipe implements PipeTransform {
  transform(dataNascimento: string): number {
    if (!dataNascimento) return 0;
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (mesNascimento > mesAtual || (mesNascimento === mesAtual && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }
}
