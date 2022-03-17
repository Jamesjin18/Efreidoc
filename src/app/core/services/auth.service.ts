import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { empty, Observable, switchMap } from 'rxjs';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router
  ) {}

  private updateUserData(user: firebase.default.User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email!,
      roles: {
        subscriber: true,
      },
    };
    return userRef.set(data, { merge: true });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(['/', 'home']);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Sign in error',
          input: error,
          inputAttributes: {
            autocapitalize: 'off',
          },
          confirmButtonText: 'Close',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      });
  }

  // SignIn(email: string, password: string) {
  //   this.afAuth.onAuthStateChanged(user => {
  //     if (user && user.emailVerified) {
  //       this.router.navigateByUrl('home');
  //     } else {
  //       console.log("email pas verifié")
  //       this.router.navigateByUrl('login');
  //     }
  //   });
  // }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
          up and returns promise */
        // this.SendVerificationMail();
        this.updateUserData(result.user!);
        this.router.navigate(['/', 'login']);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Sign in error',
          input: error,
          inputAttributes: {
            autocapitalize: 'off',
          },
          confirmButtonText: 'Close',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      });
  }

  // Send email verfificaiton when new user sign up
  // SendVerificationMail() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['/','login']);
  //       alert("Rechargez la page après avoir validé votre email")
  //     });
  // }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut();
  }
}
