import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as uiAction from 'src/app/shared/ui.actions';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private _auth: AuthService,
    private store: Store<AppState>,
    private router: Router) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.loading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe()
  }

  login() {
    if (this.loginForm.invalid)
      return;

    this.store.dispatch(uiAction.isLoading());

    // Swal.fire({
    //   title: 'Espero por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { correo, password } = this.loginForm.value;

    this._auth.login(correo, password).then(res => {
      // Swal.close();
      this.store.dispatch(uiAction.stopLoading());
      this.router.navigate(['/dashboard']);
    })
      .catch(err => {
        this.store.dispatch(uiAction.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      });
  }
}
