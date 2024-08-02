import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { PasswordResetService } from "src/app/core/services/password.reset.service";

@Component({
  selector: "app-passwordreset",
  templateUrl: "./passwordreset.component.html",
  styleUrls: ["./passwordreset.component.scss"],
})
export class PasswordresetComponent implements OnInit, AfterViewInit {
  resetForm: UntypedFormGroup;
  submitted = false;
  error = "";
  loading = false;
  mensagem: string | null = null;
  success: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private _passwordResetService: PasswordResetService
  ) {}

  ngOnInit() {
    document.body.removeAttribute("data-layout");
    document.body.classList.add("auth-body-bg");

    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {}

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    this._passwordResetService.recuperarSenha(this.resetForm.value).subscribe((res) => {
        this.loading = false;
        if (res.success === "true") {
          this.success = true;
          this.mensagem = res.msg;
        } else {
          this.success = false;
          this.mensagem = res.msg;
        }
      },
      (error) => {
        this.loading = false;
        this.success = false;
        this.mensagem = "Erro ao enviar a senha. Tente novamente.";
      }
    );
  }
}
