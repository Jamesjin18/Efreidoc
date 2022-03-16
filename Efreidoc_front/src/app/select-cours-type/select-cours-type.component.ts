import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-cours-type',
  templateUrl: './select-cours-type.component.html',
  styleUrls: ['./select-cours-type.component.css']
})
export class SelectCoursTypeComponent implements OnInit {

  selectedPromo!: string;
  selectedClass!: string;
  selectedCours!: string;

  coursTypeSnap: any;
  constructor(
    private router: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.selectedPromo = params['promo'];
      this.selectedClass = params['class'];
      this.selectedCours = params['cours'];
    });
    this.afs
      .collection('efrei/' + this.selectedPromo + '/class/'+this.selectedClass+'/cours/'+this.selectedCours+'/coursType')
      .ref.get()
      .then((data) => (this.coursTypeSnap = data.docs));
  }

}
