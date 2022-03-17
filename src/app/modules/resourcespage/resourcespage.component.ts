import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-resourcespage',
  templateUrl: './resourcespage.component.html',
  styleUrls: ['./resourcespage.component.css'],
})
export class ResourcespageComponent implements OnInit {
  ressourcetitle = '';

  constructor(public navigationservice: NavigationService) {}

  ngOnInit(): void {
    this.ressourcetitle = this.navigationservice.getRessource();
  }
}
