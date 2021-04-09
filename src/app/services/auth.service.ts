import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authAction from '../auth/auth.actions';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _userValue: Usuario;

  constructor(private _authFire: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }


  get user(){
    return this._userValue;
  }

  initAuthListener(){
    return this._authFire.authState.subscribe(fuser => {
      // console.log(fuser);
      if(fuser){
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe((firestoreUser: any) =>{

          const user = Usuario.fromFirebase(firestoreUser);
          this._userValue = user;
          this.store.dispatch(authAction.setUser({ user }));

        });
      }else{
        this._userValue = null;
        this.store.dispatch(authAction.unSetUser());
        this.store.dispatch(ieActions.unSetItems());
        this.userSubscription?.unsubscribe();
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string){
    return this._authFire.createUserWithEmailAndPassword(email, password)
    .then(({ user }) => { //esto es la desestructuracion del objeto ya que el response viene con la property user
        const newUser = new Usuario(user.uid, nombre, email);
        return this.firestore.doc(`${user.uid}/usuario`).set({...newUser}); //desestructuracion del newUser separa cada propuedad
    });
  }

  login(correo: string, password: string){
    return this._authFire.signInWithEmailAndPassword(correo, password);
  }

  logout(){
    return this._authFire.signOut();
  }

  isAuth(){
    return this._authFire.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }
}
