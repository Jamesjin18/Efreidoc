import { Injectable } from "@angular/core";
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({providedIn: "root"})
export class AuthService {
    userData: any; // Save logged in user data
    constructor(
      public afs: AngularFirestore, // Inject Firestore service
      public afAuth: AngularFireAuth, // Inject Firebase auth service
      public router: Router
    ) {}

    // Sign in with email/password
    SignIn(email: string, password: string) {
      var user = this.afAuth.currentUser;
      console.log(user.then(u => u?.emailVerified))
      this.afAuth.currentUser.then((u: any) => {
        if(u.emailVerified){
          return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
              this.router.navigate(['/', 'home'])
            })
            .catch((error) => {
              window.alert(error.message);
            });
        } else {
          window.alert("email not verified")
          return
        }
      })
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
          this.SendVerificationMail();
        })
        .catch((error) => {
          window.alert(error.message);
        });
    }

    // Send email verfificaiton when new user sign up
    SendVerificationMail() {
      return this.afAuth.currentUser
        .then((u: any) => u.sendEmailVerification())
        .then(() => {
          this.router.navigate(['/','login']);
        });
    }

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
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['sign-in']);
      });
    }
  }