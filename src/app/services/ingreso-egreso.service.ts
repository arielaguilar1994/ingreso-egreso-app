import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private _auth: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const UID = this._auth.user.uid;

    return this.firestore.doc(`${ UID }/ingreso-egreso`)
      .collection('Items')
      .add( { ...ingresoEgreso } ) //de esta forma transformo la instancia de la clase en un objeto
  }

  ingresoEgresoListener(uid: string){
    return this.firestore.collection(`${uid}/ingreso-egreso/Items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => {
          return snapshot.map(doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            };
          });
        })
      );
  }

  deleteIngresoEgreso(uid:string){
    const uid_User = this._auth.user.uid;
    return this.firestore.doc(`${uid_User}/ingreso-egreso/Items/${uid}`).delete();
  }
}
