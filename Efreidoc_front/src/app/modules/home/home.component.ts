import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  annees = ["Master 2","Master 1","Licence 3", "Licence 2", "Licence 1"]

  constructor() { }

  ngOnInit(): void {
  }

}
