import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TableService } from 'src/app/core/services/table.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  documentsSnap: any;
  constructor(private afs:AngularFirestore, private afAuth:AngularFireAuth,private tableService:TableService,private authService:AuthService,public appComponent:AppComponent ) {
    
  }

  ngOnInit(): void {
    this.afAuth.currentUser.then((user)=>{
      this.afs
      .collection('users').doc(user!.uid).collection('upload')
      .ref.get()
      .then((data) => (this.documentsSnap = data.docs));
    })
  }
  
  async pageTokenExample(folder: string, folderinit: string) {
    this.tableService.pageTokenExample(folder,folderinit)
  }

  updateUserPassword() {
    this.afAuth.authState.subscribe((user:any) => {
      this.authService.ForgotPassword(user.email);
    })
  }

  popUpDescriptionSize(desc: string) {
    this.tableService.popUpDescriptionSize(desc);
  }

}
