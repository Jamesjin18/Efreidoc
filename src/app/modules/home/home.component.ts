import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  promoSnap: any;

  constructor(
    private afs: AngularFirestore,
    private router: ActivatedRoute,
    private _route: Router,
    public afAuth: AngularFireAuth,
    public appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.afAuth.currentUser.then((e) => {
      console.log(e?.metadata);
    });
    this.afs
      .collection('efrei')
      .ref.get()
      .then((data) => {
        this.promoSnap = data.docs;
      });
  }

  delete(target: string) {
    Swal.fire({
      title: 'Êtes vous sûr de vouloir supprimer ' + target + '?',
      text: 'Vous ne pourrez plus revenir en arrière',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non, annuler',
      confirmButtonText: 'Oui, supprimer!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteFiles(target);
        Swal.fire('Supprimer!', 'Tout a été supprimé.', 'success');
        this.ngOnInit();
      }
    });
  }

  modify(target: string) {
    Swal.fire({
      title: 'Renommer ' + target + ' ',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Finish',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (result.value) {
          await this.updatePromo(target, result.value);
          this.ngOnInit();
        }
      }
    });
  }
  openAddPromo() {
    Swal.fire({
      title: 'Name of promotion',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Finish',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          this.addPromo(result.value);
          this.ngOnInit();
        }
      }
    });
  }

  async deleteFiles(target: string) {
    const db = getFirestore();
    // Remove the 'capital' field from the document
    await deleteDoc(doc(db, 'efrei', target));
  }

  async updatePromo(target: string, namePromo: string) {
    const db = getFirestore();
    const docRef = doc(db, 'efrei', target);
    const docSnap = await getDoc(docRef);
    var data = docSnap.data;

    await this.deleteFiles(target);
    await setDoc(doc(db, 'efrei', namePromo), data);

    var docRefinit = this.afs.collection('efrei');
  }

  ah() {
    var docRefinit = this.afs.collection('efrei');
    this.funcUpdateCollection(docRefinit);
  }

  funcUpdateCollection(docRef: AngularFirestoreCollection<unknown>) {
    docRef.ref.get().then((docs) => {
      docs.forEach((doc) => {
        console.log(doc.id);
        this.funcUpdateDocument(docRef.doc(doc.id));
      });
    });
  }

  funcUpdateDocument(docRef: AngularFirestoreDocument<unknown>) {
    docRef.ref.get().then((collections) => {
      console.log(collections.metadata);
    });
  }

  addPromo(namePromo: string) {
    this.afs.collection('efrei').doc(namePromo).set({}, { merge: true });
  }
}
