import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public afAuth: AngularFireAuth) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          if (user.emailVerified) {
            resolve(true);
          } else {
            this.router.navigate(['/login']);
            reject(false);
          }
        } else {
          this.router.navigate(['/login']);
          reject(false);
        }
      });
    });
  }
}
