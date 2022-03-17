import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { getAuth, sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)],
    ],
  });

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {}

  onSubmit() {
    const email = this.signUpForm.get('email')!.value;
    const password = this.signUpForm.get('password')!.value;
    this.auth
      .SignUp(email, password)
      .then(() => {
        console.log('signup success');
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          sendEmailVerification(currentUser).then(() => {
            // Email verification sent!
            console.log('email verification sent');
          });
        } else {
          console.log('no current user');
        }
      })
      .catch(() => {
        console.log('error signup');
      });
  }
}
