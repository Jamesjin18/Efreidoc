import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-select-cours',
  templateUrl: './select-cours.component.html',
  styleUrls: ['./select-cours.component.css'],
})
export class SelectCoursComponent implements OnInit {
  selectedPromo!: string;
  selectedClass!: string;
  coursSnap: any;
  constructor(
    private router: ActivatedRoute,
    private afs: AngularFirestore,
    public appComponent: AppComponent
  ) {}

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
      .then((data) => (this.coursSnap = data.docs));
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
        }
      }
    });
  }

  addMatiere(nameMatiere: string) {
    this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(nameMatiere)
      .set({}, { merge: true });
  }
}
