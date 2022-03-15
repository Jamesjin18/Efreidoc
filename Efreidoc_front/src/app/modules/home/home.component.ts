import { Component, OnInit } from '@angular/core';

import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  promoSnap: any;

  constructor(private afs:AngularFirestore, private router: ActivatedRoute, private _route:Router) { }

  ngOnInit(): void {
    this.afs.collection('efrei').ref.get().then(data => this.promoSnap = data.docs)
  }
}
