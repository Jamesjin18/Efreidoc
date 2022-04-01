import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayRemove } from 'firebase/firestore';

@Component({
  selector: 'app-previous-route',
  templateUrl: './previous-route.component.html',
  styleUrls: ['./previous-route.component.css'],
})
export class PreviousRouteComponent implements OnInit {
  @Input() arrPath: Array<string>;
  public mapPath: Map<string, string>;
  promoName = '';
  className = '';
  coursName = '';
  coursTypeName = '';

  selectedPromo = '';
  selectedClass = '';
  selectedCours = '';
  selectedCoursType = '';
  constructor(private afs: AngularFirestore) {
    this.arrPath = new Array<string>();
    this.mapPath = new Map<string, string>();
  }

  async ngOnInit(): Promise<void> {
    this.mapPath = await this.getPreviousPath(this.arrPath);
  }

  unsorted(a: any, b: any) {
    return 1;
  }

  async getPreviousPath(href: Array<string>) {
    let currPath = '';
    const arr = new Map<string, string>();
    for (let i = 0; i < href.length; i++) {
      if (i === 1) {
        this.selectedPromo = href[i];
        await this.getPromoName();
      } else if (i === 2) {
        this.selectedClass = href[i];
        await this.getClassName();
      } else if (i === 3) {
        this.selectedCours = href[i];
        await this.getCoursName();
      } else if (i === 4) {
        this.selectedCoursType = href[i];
        await this.getCoursType();
      }
    }
    for (let i = 0; i < href.length; i++) {
      if (i === 0) {
        currPath += '/' + href[i];
        arr.set(href[i], currPath);
      } else if (i === 1) {
        currPath += '/' + href[i];
        arr.set(this.promoName, currPath);
      } else if (i === 2) {
        currPath += '/' + href[i];
        arr.set(this.className, currPath);
      } else if (i === 3) {
        currPath += '/' + href[i];
        arr.set(this.coursName, currPath);
      } else if (i === 4) {
        currPath += '/' + href[i];
        arr.set(this.coursTypeName, currPath);
      }
    }
    return arr;
  }

  public async getCoursType() {
    const coursType = await this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(this.selectedCoursType)
      .ref.get();
    this.coursTypeName = coursType.get('name');
  }

  public async getPromoName() {
    const promo = await this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .ref.get();
    this.promoName = promo.get('name');
  }

  public async getClassName() {
    const classe = await this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .ref.get();
    this.className = classe.get('name');
  }

  public async getCoursName() {
    const cours = await this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .ref.get();
    this.coursName = cours.get('name');
  }
}
