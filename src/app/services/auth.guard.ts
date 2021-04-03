import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _auth: AuthService, private router: Router){

  }

  canActivate(): Observable<boolean> {
    return  this._auth.isAuth().pipe(
      tap( isAuth => {
        if(!isAuth) this.router.navigate(['/login']);
      })
    );
  }
  
}
