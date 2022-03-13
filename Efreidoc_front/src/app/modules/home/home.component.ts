import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  annees = ["Master 2","Master 1","Licence 3", "Licence 2", "Licence 1"]

  constructor(public navigationservice: NavigationService,
              public router: Router) { }

  ngOnInit(): void {
  }

  goToSelecmat(annee : string) {
    console.log(annee);
    this.navigationservice.setAnnee(annee);
    this.router.navigate(['/','selecmat']);
  }

}
