import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)],
    ],
    promotion: ['', [Validators.required]],
    cgu: ['', [Validators.required, Validators.requiredTrue]]
  });
  promos: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.afs
      .collection('efrei')
      .ref.get()
      .then((promos) => {
        promos.forEach((promo) => {
          this.promos.push(promo.get('name'));
        });
      });
  }

  onSubmit() {
    const email = this.signUpForm.get('email')!.value;
    const password = this.signUpForm.get('password')!.value;
    const promotion = this.signUpForm.get('promotion')!.value;
    this.auth.SignUp(email, password, promotion).then(() => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        sendEmailVerification(currentUser).then(() => {
          Swal.fire({
            title:
              'Confirmez votre email afin de pouvoir accéder aux ressources',
            confirmButtonText: 'Fermer',
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            }
          });
        });
      }
    });
  }
}
