import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm = this.formBuilder.group( 
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    }
  ) 

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService) {
              }

  ngOnInit(): void {
  }

  onSubmit(){
    const email = this.signUpForm.get('email')!.value;
    const password = this.signUpForm.get('password')!.value;
    this.auth.SignUp(email, password);
  }

}
