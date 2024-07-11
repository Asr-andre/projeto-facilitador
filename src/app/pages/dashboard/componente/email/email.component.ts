import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModel } from 'src/app/core/models/email.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent implements OnInit, OnChanges{
  @Input() idCliente: number | undefined;
  public loading: boolean = false;
  public emails: EmailModel[] = [];

  constructor(
    private _emailService: EmailService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.carregarEmails(this.idCliente);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.carregarEmails(this.idCliente);
    }
  }

  public carregarEmails(idCliente: number): void {
    this.loading = true;
    this._emailService.obterEmailPorIdcliente(idCliente).subscribe((res) => {
      this.emails = res;
      this.loading = false;
    },
      (error) => {
        console.error('Erro ao carregar emails:', error);
        this.loading = false;
      }
    );
  }

}
