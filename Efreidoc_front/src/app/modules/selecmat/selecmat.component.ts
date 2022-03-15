import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MajeurService } from 'src/app/core/services/majeur.service';
import { Majeur } from 'src/app/models/majeur';
@Component({
  selector: 'app-selecmat',
  templateUrl: './selecmat.component.html',
  styleUrls: ['./selecmat.component.css']
})
export class SelecmatComponent implements OnInit {
  majeurList: Majeur[] | undefined;

  constructor(private afs:AngularFirestore, private majeurService: MajeurService) {
  }
  
  ngOnInit(): void {

    this.afs.collection('efrei').ref.get().then(data => data.forEach(ele => console.log(ele.id)))
  }
  
}
