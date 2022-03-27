import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppComponent } from '../../app.component';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
@Component({
  selector: 'app-select-cours',
  templateUrl: './select-cours.component.html',
  styleUrls: ['./select-cours.component.css'],
})
export class SelectCoursComponent implements OnInit {
  selectedPromo!: string;
  selectedClass!: string;
  coursSnap: firebase.firestore.QueryDocumentSnapshot<unknown>[] = [];
  arrPath: string[];
  constructor(
    private router: ActivatedRoute,
    private afs: AngularFirestore,
    public appComponent: AppComponent,
    private route: Router
  ) {
    this.arrPath = new Array<string>();
  }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.selectedPromo = params['promo'];
      this.selectedClass = params['class'];
    });
    this.afs
      .collection(
        'efrei/' +
          this.selectedPromo +
          '/class/' +
          this.selectedClass +
          '/cours'
      )
      .ref.get()
      .then((data) => {
        this.coursSnap = data.docs;
        this.coursSnap.sort((a, b) => this.compare(a, b));
      });
    this.arrPath = decodeURI(this.route.url.substring(1)).split('/');
  }

  compare(a: any, b: any) {
    if (a.get('name') < b.get('name')) {
      return -1;
    }
    if (a.get('name') > b.get('name')) {
      return 1;
    }
    return 0;
  }

  openAddMatiere() {
    Swal.fire({
      title: 'Nom de la matière',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'ajouter',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          this.addMatiere(result.value);
          this.ngOnInit();
        }
      }
    });
  }

  addMatiere(nameMatiere: string) {
    const date = new Date();
    const dateUpload = date.getTime();
    this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(dateUpload.toString())
      .set({ name: nameMatiere }, { merge: true });
  }
  modify(target: string, name: string) {
    Swal.fire({
      title: 'Renommer ' + name + ' ',
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
  delete(target: string, name: string) {
    Swal.fire({
      title: 'Êtes vous sûr de vouloir supprimer ' + name + '?',
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
    await deleteDoc(
      doc(
        db,
        'efrei',
        this.selectedPromo,
        'class',
        this.selectedClass,
        'cours',
        target
      )
    );
  }

  async updatePromo(target: string, namePromo: string) {
    const db = getFirestore();
    const docRef = doc(
      db,
      'efrei',
      this.selectedPromo,
      'class',
      this.selectedClass,
      'cours',
      target
    );
    await updateDoc(docRef, {
      name: namePromo,
    });
  }
}
