import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelefoneModel } from 'src/app/core/models/telefone.model';
import { TelefoneService } from 'src/app/core/services/cadastro/telefone.service';

@Component({
  selector: 'app-telefone',
  templateUrl: './telefone.component.html',
  styleUrl: './telefone.component.scss'
})
export class TelefoneComponent implements OnInit {

  @Input() idCliente: number | undefined;
  public telefones: TelefoneModel[] = [];
  public loading: boolean = false;
  public telefoneForm: FormGroup;

  constructor(private _telefoneService: TelefoneService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    if (this.idCliente) {
      this.carregarTelefones(this.idCliente);
    }
    this.inicializarTelefoneForm();
  }

  public inicializarTelefoneForm() {
    this.telefoneForm = this.fb.group({
      id_cliente: this.idCliente,
      fone: ['', Validators.required, Validators.pattern('[0-9]*')],
      tipo: ['', Validators.required],
      prioritario: ['', Validators.required],
      status_fone: ['', Validators.required],
      whatsapp: ['', Validators.required],
      obs_fone: ['Cadastro']
    });
  }

  public carregarTelefones(idCliente: number): void {
    this.loading = true;
    this._telefoneService.obterTelefonesPorCliente(idCliente).subscribe((telefones) => {
      this.telefones = telefones;
      this.loading = false;
    },
      (error) => {
        console.error('Erro ao carregar telefones:', error);
        this.loading = false;
      }
    );
  }

  tipoTelefone(tipo: number): string {
    switch (tipo) {
      case 1: return 'Fixo Residencial';
      case 2: return 'Fixo Comercial';
      case 3: return 'Fixo Trabalho';
      case 4: return 'Fixo Referencia';
      case 5: return 'Fixo Vizinho';
      case 6: return 'Fixo Avalista';
      case 7: return 'Celular Pessoal';
      case 8: return 'Celular Comercial';
      case 9: return 'Celular Trabalho';
      case 10: return 'Celular Referencia';
      case 11: return 'Celular Vizinho';
      case 12: return 'Celular Avalista';
      case 13: return 'Celular Conjuge';
      case 14: return 'Outros';
      default: return 'Desconhecido';
    }
  }

  statusTelefone(status: string): string {
    switch (status) {
      case 'A': return 'Ativo';
      case 'P': return 'Positivo';
      case 'N': return 'Negativo';
      default: return 'Desconhecido';
    }
  }

  openModal(content: TemplateRef<any>): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(modal: any): void {
    if (this.telefoneForm.valid) {
      this.loading = true;
      this._telefoneService.cadastrarTelefone(this.telefoneForm.value).subscribe(
        (response) => {
          this.carregarTelefones(this.idCliente);
          modal.close();
        },
        (error) => {
          console.error('Erro ao cadastrar telefone:', error);
          this.loading = false;
        }
      );
    }
  }
}
