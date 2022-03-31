import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css'],
})
export class ClassementComponent implements OnInit {
  public array: Array<number>;
  constructor(
    private afs: AngularFirestore,
    public appComponent: AppComponent
  ) {
    this.array = new Array<number>();
  }

  ngOnInit(): void {
    this.afs
      .collection('users')
      .ref.get()
      .then((data) => {
        data.docs.forEach(async (element) => {
          const score = await this.getScore(element);
          this.array[element.get('email')] = score;
          this.array.sort();
        });
      });
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
