import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MajeurService } from 'src/app/services/majeur.service';
@Component({
  selector: 'app-selecmat',
  templateUrl: './selecmat.component.html',
  styleUrls: ['./selecmat.component.css']
})
export class SelecmatComponent implements OnInit {
  @Input() majeurName:String = 'Matiere'
  testMajeur = ['SE','Big Data','IA']
  majeur2:Observable<any>
  constructor(majeurService: MajeurService) {
    this.majeur2 = majeurService.getMajeurs()
  }

  ngOnInit(): void {
  }
  
}
