import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  current_route = '';
  constructor(public authservice: AuthService, private router:Router) {
    this.current_route = this.router.url;
    console.log(this.current_route)
  }

  signout() {
    this.authservice.SignOut();
  }
}
