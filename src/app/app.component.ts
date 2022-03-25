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
  public percent: number = 0;

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
          this.afs
            .collection('users')
            .doc(user.uid)
            .ref.get()
            .then((data) => {
              if (data.exists) {
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
              }
            });
        } else {
          this.user = undefined;
        }
      } else {
        this.user = undefined;
      }
    });
  }
}
