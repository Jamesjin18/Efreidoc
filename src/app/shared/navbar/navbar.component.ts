import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  current_route = '';

  constructor(
    public authservice: AuthService,
    private router: Router,
    public appComponent: AppComponent
  ) {
    this.current_route = this.router.url;
  }

  signout() {
    this.authservice.SignOut();
  }
}
