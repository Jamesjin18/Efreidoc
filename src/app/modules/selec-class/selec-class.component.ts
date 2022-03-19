import { Component, OnInit } from '@angular/core';
import { AngularFireAction } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppComponent } from '../../app.component';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
@Component({
  selector: 'app-selec-class',
  templateUrl: './selec-class.component.html',
  styleUrls: ['./selec-class.component.css'],
})
export class SelecClassComponent implements OnInit {
  selectedPromo!: string;
  public arrPath: Array<string>;

  classSnap: any;
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private afs: AngularFirestore,
    public appComponent: AppComponent
  ) {
    this.arrPath = new Array<string>();
  }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.selectedPromo = params['promo'];
    });
    this.afs
      .collection('efrei/' + this.selectedPromo + '/class')
      .ref.get()
      .then((data) => (this.classSnap = data.docs));

    this.arrPath = decodeURI(this.route.url.substring(1)).split('/');
  }

  openAddClasses() {
    Swal.fire({
      title: 'Nom de la classe',
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
          this.addClasses(result.value);
        }
      }
    });
  }

  addClasses(nameClasses: string) {
    this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(nameClasses)
      .set({}, { merge: true });
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
    await deleteDoc(doc(db, 'efrei', this.selectedPromo, 'class', target));
  }

  async updatePromo(target: string, namePromo: string) {
    const db = getFirestore();
    const docRef = doc(db, 'efrei', this.selectedPromo, 'class', target);
    await updateDoc(docRef, {
      name: namePromo,
    });
  }
}
