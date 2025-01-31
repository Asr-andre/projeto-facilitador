import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Telefone {
  nome: string;
  numero: string;
  tipo: string;
  observacoes: string;
}

@Component({
  selector: 'app-modal-telefone',
  templateUrl: './modal-telefone.component.html',
  styleUrl: './modal-telefone.component.scss'
})
export class ModalTelefoneComponent {
  telefoneForm: FormGroup;
  telefonesCadastrados: Telefone[] = [];

  constructor(private fb: FormBuilder) {
    this.telefoneForm = this.fb.group({
      nome: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]], // Validação para telefone com 10 ou 11 dígitos
      tipo: ['Celular', Validators.required],
      observacoes: ['']
    });
  }

  adicionarTelefone() {
    if (this.telefoneForm.valid) {
      this.telefonesCadastrados.push(this.telefoneForm.value);
      this.telefoneForm.reset({ tipo: 'Celular' }); // Reseta o formulário, mantendo o tipo como "Celular"
    }
  }

  removerTelefone(index: number) {
    this.telefonesCadastrados.splice(index, 1);
  }
}
