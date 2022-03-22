import { Component, OnInit } from '@angular/core';
import { ResearchService } from 'src/app/core/services/research.service';

@Component({
  selector: 'app-research-bar',
  templateUrl: './research-bar.component.html',
  styleUrls: ['./research-bar.component.css']
})
export class ResearchBarComponent implements OnInit {

  constructor(public researchService:ResearchService) { }

  ngOnInit(): void {
  }

  async search() {
    this.researchService.search()
  }

}
