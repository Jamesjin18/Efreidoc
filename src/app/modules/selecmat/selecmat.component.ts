import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MajeurService } from 'src/app/core/services/majeur.service';
import { Majeur } from 'src/app/models/majeur';
@Component({
  selector: 'app-selecmat',
  templateUrl: './selecmat.component.html',
  styleUrls: ['./selecmat.component.css'],
})
export class SelecmatComponent implements OnInit {
  majeurList: Majeur[] | undefined;
  public arrPath: string[];

  constructor(
    private afs: AngularFirestore,
    private majeurService: MajeurService,
    private route: Router
  ) {
    this.arrPath = new Array<string>();
  }

  ngOnInit(): void {
    this.afs
      .collection('efrei')
      .ref.get()
      .then((data) => data.forEach((ele) => console.log(ele.id)));
    this.arrPath = decodeURI(this.route.url.substring(1)).split('/');
  }
}
