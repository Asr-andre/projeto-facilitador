import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  currentUser: any;
  public loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      sigla: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });

    // Obter o returnUrl dos queryParams
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  get f() {
    return this.loginForm.controls;
  }

  validarLogin(event: Event) {
    event.preventDefault();
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    const { sigla, login, senha } = this.loginForm.value;

    this.authenticationService.login(sigla, login, senha)
      .subscribe( data => {
          if (data && data['success'] === 'true') {
            this.router.navigate([this.returnUrl]);
            this.currentUser = this.authenticationService.getCurrentUser();
          } else {
            this.error = data['msg'] || 'Erro ao tentar autenticar.';
          }
        },
        error => {
          this.error = error.message || 'Ocorreu um erro ao tentar autenticar. Por favor, tente novamente.';
        });
  }
}
