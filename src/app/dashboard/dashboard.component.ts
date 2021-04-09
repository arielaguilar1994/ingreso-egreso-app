import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ieAction from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  ieSubscription: Subscription;

  constructor(private store: Store<AppState>, private _ingresoEgreso: IngresoEgresoService) { }

  ngOnInit(): void {
    this.subscription = this.store.select('auth')
    .pipe(
      filter(auth => auth.user != null)
    )
    .subscribe(({ user }) => {
      this.ieSubscription = this._ingresoEgreso.ingresoEgresoListener(user.uid)
          .subscribe((ieItems: IngresoEgreso[]) => {
            this.store.dispatch(ieAction.setItems({items: ieItems}))
          })
    });
  }

  ngOnDestroy(): void {
    this.ieSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

}
