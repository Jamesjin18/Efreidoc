import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TableService } from 'src/app/core/services/table.service';
import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css'],
})
export class CompteComponent implements OnInit {
  documentsSnap: any;
  promos: string[] = [];
  selectedPromo = '';
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private tableService: TableService,
    private authService: AuthService,
    public appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      this.afs
        .collection('users')
        .doc(user!.uid)
        .collection('upload')
        .ref.get()
        .then((data) => (this.documentsSnap = data.docs));
    });
    this.afs
      .collection('efrei')
      .ref.get()
      .then((promos) => {
        promos.forEach((promo) => {
          this.promos.push(promo.get('name'));
        });
      });
    this.afAuth.currentUser.then((user) => {
      this.afs
        .collection('users')
        .doc(user!.uid)
        .ref.get()
        .then((users) => {
          this.selectedPromo = users.get('promotion.promotion');
        });
    });
  }

  modify() {
    const date = new Date();
    const dateChange = date.getTime();
    const dateSummer = new Date(date.getFullYear(), 8, 0, 0, 0, 0, 0);
    const dateSummerms = dateSummer.getTime();
    if (
      (this.appComponent.user!.promotion.date < dateSummerms &&
        dateChange > dateSummerms) ||
      dateSummerms - this.appComponent.user!.promotion.date > 31536000000
    ) {
      this.appComponent.user!.promotion.change = 1;
    }
    if (this.appComponent.user!.promotion.change > 0) {
      if (this.appComponent.user!.promotion.promotion !== this.selectedPromo) {
        Swal.fire({
          title: 'Changer de promotion',
          text:
            'Voulez passer de la promotion ' +
            this.appComponent.user!.promotion.promotion +
            ', pour la promotion ' +
            this.selectedPromo +
            ' ? Vous pouvez changer encore ' +
            this.appComponent.user!.promotion.change +
            ' fois.',

          showCancelButton: true,
          confirmButtonText: 'Finish',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.afs
              .collection('users')
              .doc(this.appComponent.user!.uid)
              .update({
                promotion: {
                  change: this.appComponent.user!.promotion.change - 1,
                  promotion: this.selectedPromo,
                  date: dateChange,
                },
              });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Changement impossible',
          text: 'Vous devez choisir une autre promotion',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Changement impossible',
        text: "Vous ne pouvez plus changer de promotion avant l'année prochaine",
      });
    }
  }

  async pageTokenExample(folder: string, folderinit: string) {
    this.tableService.pageTokenExample(folder, folderinit);
  }

  updateUserPassword() {
    this.afAuth.authState.subscribe((user: any) => {
      this.authService.ForgotPassword(user.email);
    });
  }

  popUpDescriptionSize(desc: string) {
    this.tableService.popUpDescriptionSize(desc);
  }

  delete(target: string, name: string, path: string) {
    Swal.fire({
      title: 'Êtes vous sûr de vouloir supprimer ' + name + '?',
      text: 'Vous ne pourrez plus revenir en arrière',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non, annuler',
      confirmButtonText: 'Oui, supprimer!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteFiles(path);
        Swal.fire('Supprimer!', 'Tout a été supprimé.', 'success');
        this.ngOnInit();
      }
    });
  }

  async deleteFiles(path: string) {
    const db = getFirestore();
    console.log(path);
    let tabPath = path.split('/');
    // Remove the 'capital' field from the document
    await deleteDoc(
      doc(
        db,
        'efrei',
        tabPath[0],
        'class',
        tabPath[1],
        'cours',
        tabPath[2],
        'coursType',
        tabPath[3],
        'documents',
        tabPath[4]
      )
    );

    await deleteDoc(
      doc(db, 'users', this.appComponent.user!.uid, 'upload', tabPath[4])
    );
  }
}
