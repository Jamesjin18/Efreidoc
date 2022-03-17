import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  recherche = '';
  resultResearch: string[] = [];
  constructor(public authservice: AuthService, private afs: AngularFirestore) {}

  signout() {
    this.authservice.SignOut();
  }

  async search() {
    this.resultResearch = [];
    const recherche = this.recherche.toLowerCase();
    console.log('search');
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'efrei'));
    querySnapshot.forEach(async (doc) => {
      if (
        doc.id.toLowerCase().includes(recherche) ||
        recherche.includes(doc.id.toLowerCase())
      ) {
        this.resultResearch.push(doc.id);
      }

      const querySnapshot2 = await getDocs(
        collection(db, 'efrei', doc.id, 'class')
      );

      querySnapshot2.forEach(async (doc2) => {
        if (
          doc2.id.toLowerCase().includes(recherche) ||
          recherche.includes(doc2.id.toLowerCase())
        ) {
          this.resultResearch.push(doc.id + '/' + doc2.id);
        }

        const querySnapshot3 = await getDocs(
          collection(db, 'efrei', doc.id, 'class', doc2.id, 'cours')
        );

        querySnapshot3.forEach(async (doc3) => {
          if (
            doc3.id.toLowerCase().includes(recherche) ||
            recherche.includes(doc3.id.toLowerCase())
          ) {
            this.resultResearch.push(doc.id + '/' + doc2.id + '/' + doc3.id);
          }
          console.log('la3');
          const querySnapshot4 = await getDocs(
            collection(
              db,
              'efrei',
              doc.id,
              'class',
              doc2.id,
              'cours',
              doc3.id,
              'coursType'
            )
          );

          querySnapshot4.forEach(async (doc4) => {
            if (
              doc4.id.toLowerCase().includes(recherche) ||
              recherche.includes(doc4.id.toLowerCase())
            ) {
              console.log('ok' + doc4.id + ' ' + recherche);
              this.resultResearch.push(
                doc.id + '/' + doc2.id + '/' + doc3.id + '/' + doc4.id
              );
            }

            const querySnapshot5 = await getDocs(
              collection(
                db,
                'efrei',
                doc.id,
                'class',
                doc2.id,
                'cours',
                doc3.id,
                'coursType',
                doc4.id,
                'documents'
              )
            );
            querySnapshot5.forEach(async (doc4) => {
              if (doc4.get('name') && doc4.get('username')) {
                if (
                  doc4.get('name').toLowerCase().includes(recherche) ||
                  recherche.includes(doc4.get('name').toLowerCase()) ||
                  doc4.get('username').toLowerCase().includes(recherche) ||
                  recherche.includes(doc4.get('username').toLowerCase())
                ) {
                  this.resultResearch.push(
                    doc.id + '/' + doc2.id + '/' + doc3.id + '/' + doc4.id
                  );
                }
                Swal.fire({
                  title: 'Results',
                  icon: 'info',
                  showClass: {
                    popup: 'animated fadeInDown faster',
                    icon: 'animated heartBeat delay-1s'
                  },
                  hideClass: {
                    popup: 'animated fadeOutUp faster',
                  },
                  html: this.arrayToListHtml(this.resultResearch)
                })
                
              }
            });
          });
        });
      });
    });
  }

  arrayToListHtml(array: Array<string>) {
    if (array.length === 0) {
      return '<p>resources not found.</p>';
    }
    let html = '<ul>';
    for(var index in array) { 
      html += '<li><a href="home/'+array[index]+'">'+array[index]+'</a></li>';
    }
    html += '</ul>';
    return html;
  }
}
