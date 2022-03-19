import { Component, OnInit } from '@angular/core';
import { AngularFireAction } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppComponent } from '../../app.component';

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
}
