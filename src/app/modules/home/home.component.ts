import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
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

  async deleteFiles(target: string) {
    const db = getFirestore();
    // Remove the 'capital' field from the document
    await deleteDoc(doc(db, 'efrei', target));
  }

  async updatePromo(target: string, namePromo: string) {
    const db = getFirestore();
    const docRef = doc(db, 'efrei', target);
    await updateDoc(docRef, {
      name: namePromo,
    });
  }

  addPromo(namePromo: string) {
    this.afs.collection('efrei').doc(namePromo).set({}, { merge: true });
  }
}
