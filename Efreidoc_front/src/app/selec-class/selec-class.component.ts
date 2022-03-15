import { Component, OnInit } from '@angular/core';
import { AngularFireAction } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-selec-class',
  templateUrl: './selec-class.component.html',
  styleUrls: ['./selec-class.component.css']
})
export class SelecClassComponent implements OnInit {
  selectedPromo!: string;
  classSnap:any;
  constructor(private router:ActivatedRoute, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.selectedPromo = params['promo'];
    });
    this.afs.collection('efrei/'+this.selectedPromo+'/class').ref.get().then(data => this.classSnap = data.docs)
  }

}
