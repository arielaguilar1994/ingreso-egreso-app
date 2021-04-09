import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as actionUI from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  type: string = 'income';
  loading: boolean = false;
  subscription: Subscription;

  constructor(private fb: FormBuilder, 
              private _ingresoEgreso: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      description: ['', Validators.required],
      total: ['', Validators.required]
    });

    this.subscription = this.store.select('ui').subscribe(ui => this.loading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  Save(): void{

    if(this.form.invalid)
      return;

    const { description, total } = this.form.value;
    const ingresoEgreso = new IngresoEgreso(description, total, this.type);
    this._ingresoEgreso.crearIngresoEgreso(ingresoEgreso).then( resp => {
      // console.log('exito!', resp);
      this.store.dispatch(actionUI.stopLoading());
      Swal.fire('Registro creado', description, 'success');
      this.form.reset();
      this.type = 'income';
    }).catch(err => {
      console.warn(err);
      this.store.dispatch(actionUI.stopLoading());
      Swal.fire('Registro no creado', err.message, 'error');
    });
  }

}
