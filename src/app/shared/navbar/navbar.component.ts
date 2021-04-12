import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  userSubcription: Subscription;
  user: Usuario;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubcription = this.store.select('auth').subscribe(({ user }) => this.user = user);
  }

  ngOnDestroy(): void {
    this.userSubcription.unsubscribe();
  }

}
