import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Indice } from 'src/app/core/models/cadastro/indice.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { IndiceService } from 'src/app/core/services/indice.service';

@Component({
  selector: 'app-indice',
  templateUrl: './indice.component.html',
  styleUrl: './indice.component.scss'
})
export class IndiceComponent implements OnInit {
  public listarIndice: Indice [] = [];
  public formIndice: FormGroup;
  public login = this._auth.getLogin();
  public loading: boolean = false;

  constructor(
    private _indiceService: IndiceService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.obterIndice();
  }

  public iniciaForm() {
    this.formIndice = this._fb.group({
      indice: ['INPC'],
      user_login: [this.login]
    });
  }

  public obterIndice() {
    const requisicao = {
      indice: 'INPC',
      user_login: this.login
    }

    this._indiceService.listarIndice(requisicao).subscribe({
      next: (res) => {

        if (res.success === 'true') {
          this.listarIndice = res.dados;
          console.log(this.listarIndice)
        } else {

        }
      },
      error: (err) => {

      }
    });
  }
}
