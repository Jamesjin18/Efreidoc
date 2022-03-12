import { Component } from '@angular/core';

import * as firebase from "@angular/fire/firestore"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Efreidoc_front';
}
