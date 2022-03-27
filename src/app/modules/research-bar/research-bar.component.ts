import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ResearchService } from 'src/app/core/services/research.service';

@Component({
  selector: 'app-research-bar',
  templateUrl: './research-bar.component.html',
  styleUrls: ['./research-bar.component.css'],
})
export class ResearchBarComponent {
  constructor(public researchService: ResearchService, public appComponent: AppComponent) {}

  async search() {
    this.researchService.search();
  }
}
