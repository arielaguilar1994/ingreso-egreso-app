import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ieSubscription: Subscription;
  ingreso: number = 0;
  egreso: number = 0;
  totalIngreso: number = 0;
  totalEgreso: number = 0;
  graficLabel: Label[] = ['Income', 'Expenses'];
  graficData: MultiDataSet = [[]];
  graficType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIngresoEgreso>) { }

  ngOnInit(): void {
    this.ieSubscription = this.store.select('ingresoEgreso')
        .subscribe(({ items }) => this.generarEstadistica(items));
  }

  ngOnDestroy(): void {
    this.ieSubscription.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]){
    this.totalEgreso = 0;
    this.totalIngreso = 0;
    this.ingreso = 0;
    this.egreso = 0;
    
    for (const item of items) {
      if(item.type === 'income'){
        this.totalIngreso += item.total;
        this.ingreso++;
      }else{
        this.totalEgreso += item.total;
        this.egreso++;
      }
    }

    this.graficData = [[this.totalIngreso, this.totalEgreso]];
  }

}
