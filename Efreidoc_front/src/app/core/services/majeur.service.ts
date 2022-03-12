import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class MajeurService {

  constructor(private firestore: AngularFirestore) {
    
  }

  getMajeurs() {
    return this.firestore.collection('majeures').get();
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
