import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from './models/user';
import { AuthService } from './core/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav | undefined;
  public user: User | undefined;
  public percent: number = 0;
  public mobile = false;
  public hovered = 'false';
  constructor(
    private auth: AuthService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {}
  title = 'Efreidoc_front';
  ngOnInit(): void {
    this.onResize();
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
  signout() {
    this.auth.SignOut();
  }
  onResize(event?: any) {
    if (window.window.innerWidth < 1200) {
      // 768px portrait
      this.mobile = true;
      this.ngOnInit();
    } else {
      this.mobile = false;
      this.ngOnInit();
    }
  }
}
