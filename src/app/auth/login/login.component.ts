import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private _auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid)
      return;


    Swal.fire({
      title: 'Espero por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { correo, password } = this.loginForm.value;

    this._auth.login(correo, password).then(res => {
      Swal.close();
      this.router.navigate(['/dashboard']);
    })
    .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      }));
  }
}
