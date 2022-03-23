import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AuthService } from './core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public user: User | undefined;

  constructor(
    private auth: AuthService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {}
  title = 'Efreidoc_front';
  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          console.log('email verified');
          console.log(
            this.afs
              .collection('users')
              .doc(user.uid)
              .ref.get()
              .then((data) => {
                if (data.exists) {
                  console.log('1');
                  this.user = {
                    email: data.get('email'),
                    roles: {
                      subscriber: data.get('roles.subscriber'),
                      admin: data.get('roles.admin'),
                      editor: data.get('roles.editor'),
                    },
                    uid: data.get('uid'),
                    promotion: data.get('promotion'),
                  };
                  console.log(this.user);
                  console.log('2');
                }
              })
          );
        } else {
          this.user = undefined;
          console.log('email not verified');
        }
      } else {
        this.user = undefined;
        console.log('no user user null');
      }
    });
  }
}
