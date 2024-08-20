import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-boleto-pix',
  templateUrl: './boleto-pix.component.html',
  styleUrl: './boleto-pix.component.scss'
})
export class BoletoPixComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;

  constructor(
    private _authService: AuthenticationService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {

    }
  }
}
