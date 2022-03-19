import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-select-cours-type',
  templateUrl: './select-cours-type.component.html',
  styleUrls: ['./select-cours-type.component.css'],
})
export class SelectCoursTypeComponent implements OnInit {
  selectedPromo!: string;
  selectedClass!: string;
  selectedCours!: string;

  coursTypeSnap: any;
  arrPath: string[];
  constructor(
    private router: ActivatedRoute,
    private afs: AngularFirestore,
    private route: Router,
    public appComponent: AppComponent
  ) {
    this.arrPath = new Array<string>();
  }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.selectedPromo = params['promo'];
      this.selectedClass = params['class'];
      this.selectedCours = params['cours'];
    });
    this.afs
      .collection(
        'efrei/' +
          this.selectedPromo +
          '/class/' +
          this.selectedClass +
          '/cours/' +
          this.selectedCours +
          '/coursType'
      )
      .ref.get()
      .then((data) => (this.coursTypeSnap = data.docs));
    this.arrPath = decodeURI(this.route.url.substring(1)).split('/');
  }

  openAddCoursType() {
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
          this.addCoursType(result.value);
        }
      }
    });
  }

  addCoursType(nameCoursType: string) {
    this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(nameCoursType)
      .set({}, { merge: true });
  }
}
