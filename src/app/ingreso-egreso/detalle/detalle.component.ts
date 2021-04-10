import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  lstIngresoEgreso: IngresoEgreso[] = [];
  ieSubscription: Subscription;

  constructor(private store: Store<AppStateWithIngresoEgreso>, private _ingresoEgreso: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ieSubscription = this.store.select('ingresoEgreso').subscribe(({items}) => this.lstIngresoEgreso = items);
  }

  ngOnDestroy(): void {
    this.ieSubscription.unsubscribe();
  }

  delete(uid: string){
    this._ingresoEgreso.deleteIngresoEgreso(uid)
    .then( () => Swal.fire('Borrado', 'Se elimino con exito!', 'success'))
    .catch( err => Swal.fire('Error', err.message, 'error') );
  }

}
