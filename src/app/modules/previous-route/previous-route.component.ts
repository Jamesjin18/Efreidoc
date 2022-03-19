import { Component, Input, OnInit } from '@angular/core';
import { arrayRemove } from 'firebase/firestore';

@Component({
  selector: 'app-previous-route',
  templateUrl: './previous-route.component.html',
  styleUrls: ['./previous-route.component.css'],
})
export class PreviousRouteComponent implements OnInit {
  @Input() arrPath: Array<string>;
  public mapPath: Map<string, string>;
  constructor() {
    this.arrPath = new Array<string>();
    this.mapPath = new Map<string, string>();
  }

  ngOnInit(): void {
    this.mapPath = this.getPreviousPath(this.arrPath);
  }

  unsorted(a: any, b: any) {
    return 1;
  }

  getPreviousPath(href: Array<string>) {
    let currPath = '';
    const arr = new Map<string, string>();
    for (let i = 0; i < href.length; i++) {
      currPath += '/' + href[i];
      arr.set(href[i], currPath);
    }
    return arr;
  }
}
