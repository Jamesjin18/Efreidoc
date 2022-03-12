import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {Item} from '../../models/Item';

@Injectable({
  providedIn: 'root'
})
export class MajeurService {

  //majeurCollection: AngularFirestoreCollection<Item>;
  majeur: Observable<Item[]>

  constructor(private firestore: AngularFirestore) {
    this.majeur = this.firestore.collection<Item>('majeures').valueChanges()
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