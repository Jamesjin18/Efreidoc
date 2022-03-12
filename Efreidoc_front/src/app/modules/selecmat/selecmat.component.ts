import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MajeurService } from 'src/app/core/services/majeur.service';
import { Item } from 'src/app/models/Item';
@Component({
  selector: 'app-selecmat',
  templateUrl: './selecmat.component.html',
  styleUrls: ['./selecmat.component.css']
})
export class SelecmatComponent implements OnInit {
  @Input() majeurName:String = 'Matiere'
  testMajeur = ['SE','Big Data','IA']
  majeurList: Item[] | undefined;

  constructor(afs:AngularFirestore, private majeurService: MajeurService) {
    this.majeurService.getMajeurs().subscribe(items => {
      //console.log(items)
      this.majeurList = items;
    })
  }
  

  ngOnInit(): void {

    
  }
  
}
