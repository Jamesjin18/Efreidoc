import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { getAuth } from 'firebase/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)],
    ],
  });

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    const email = this.signInForm.get('email')!.value;
    const password = this.signInForm.get('password')!.value;
    this.auth.SignIn(email, password).then(() => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user !== null) {
        const emailVerified = user.emailVerified;
        if (emailVerified === false) {
          this.auth.SignOut();
          console.log('email not verified');
        } else {
          console.log('login success');
        }
      }
    });
  }
}
