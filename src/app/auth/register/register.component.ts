import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder, 
    private _auth: AuthService, 
    private store: Store<AppState>,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => this.loading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if (this.registerForm.invalid)
      return;

    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espero por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { nombre, correo, password } = this.registerForm.value;

    this._auth.crearUsuario(nombre, correo, password).then(resp => {
      // Swal.close();
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    })
      .catch(err => {
        this.store.dispatch(ui.stopLoading())
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })});
  }

}
