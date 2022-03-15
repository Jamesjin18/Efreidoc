import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-cours',
  templateUrl: './select-cours.component.html',
  styleUrls: ['./select-cours.component.css']
})
export class SelectCoursComponent implements OnInit {
  selectedPromo!: string;
  selectedClass!: string;
  coursSnap:any;
  constructor(private router:ActivatedRoute, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.selectedPromo = params['promo'];
      this.selectedClass = params['class'];
    });
    this.afs.collection('efrei/'+this.selectedPromo+'/class/'+this.selectedClass+'/cours').ref.get().then(data => this.coursSnap = data.docs)
  }

}
