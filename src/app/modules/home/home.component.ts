import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';

import {
  AngularFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';

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
        }
      }
    });
  }

  addPromo(namePromo: string) {
    this.afs.collection('efrei').doc(namePromo).set({}, { merge: true });
  }
}
