import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {Majeur} from '../../models/majeur';

@Injectable({
  providedIn: 'root'
})
export class MajeurService {

  //majeurCollection: AngularFirestoreCollection<Item>;
  majeur: Observable<Majeur[]>

  constructor(private firestore: AngularFirestore) {
    this.majeur = this.firestore.collection<Majeur>('majeures').valueChanges({idField: 'id'})
  }

  getMajeurs() {
    return this.majeur
  }

  /**
   * ToDo: instead update or delete courses from majeur
   * @param majeur Majeur
   */
  // updateMajeur(majeur: Majeur){
  //   delete majeur.id;
  //   this.firestore.doc('majeurs/' + majeur.id).update(majeur);
  // }

  // deleteMajeur(id: string){
  //   this.firestore.doc('majeurs/' + id).delete();
  // }

}