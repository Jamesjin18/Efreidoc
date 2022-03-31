import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AppComponent } from 'src/app/app.component';
import { Classement } from 'src/app/models/classement';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css'],
})
export class ClassementComponent implements OnInit {
  public array: Classement[] = [];
  constructor(
    private afs: AngularFirestore,
    public appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.afs
      .collection('users')
      .ref.get()
      .then((data) => {
        data.docs.forEach(async (element) => {
          const score = await this.getScore(element);
          this.array.push({ email: element.get('email'), score: score });
          this.array.sort((a, b) => this.compare(a, b));
        });
        console.log(this.array);
      });
  }

  compare(a: any, b: any) {
    console.log('hey');
    console.log(a);
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  }

  async getScore(
    userSnap: firebase.default.firestore.QueryDocumentSnapshot<unknown>
  ) {
    let score = 0;
    const uploads = await this.afs
      .collection('users')
      .doc(userSnap.id)
      .collection('upload')
      .ref.get();
    uploads.forEach((element) => {
      score += element.get('numberLike') - element.get('numberDisslike');
    });
    return score;
  }

  unsorted(a: any, b: any) {
    return 1;
  }
}
