import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  user: Usuario;

  constructor(private _auth: AuthService, 
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').subscribe(({user}) => this.user = user);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout(){
    this._auth.logout()
      .then( res => this.router.navigate(['/login']))
      .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      }));
  }
}
