import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { resourceUsage } from 'process';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  constructor(public router: Router,
              public navigationservice: NavigationService) { }

  ngOnInit(): void {
  }

  goToResourcespage(ressource: string){
    console.log(ressource)
    this.navigationservice.setRessource(ressource);
    this.router.navigate(['/','resourcespage']);
  }

}
