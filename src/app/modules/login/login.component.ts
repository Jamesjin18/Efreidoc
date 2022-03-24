import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)],
    ],
  });

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {}

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
          this.popUpEmailNotVerified();
          console.log('Email non vérifié');
        } else {
          console.log('login avec succès');
        }
      }
    });
  }

  popUpEmailNotVerified() {
    Swal.fire({
      icon: 'error',
      title: 'Email non vérifié',
      text: 'Cliquez sur le lien de validation envoyer par mail',
    });
  }
}
