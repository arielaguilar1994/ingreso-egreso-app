import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _authFire: AngularFireAuth, private firestore: AngularFirestore) { }

  initAuthListener(){
    return this._authFire.authState.subscribe(fuser => {
      console.log(fuser);
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
