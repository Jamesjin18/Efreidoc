import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { getDownloadURL, getStorage, list, ref } from 'firebase/storage';
import { fileToZip } from '../../models/listFileToZip';
import * as JSZip from 'jszip';
import { FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppComponent } from 'src/app/app.component';
import { doc } from 'firebase/firestore';
import { TableService } from 'src/app/core/services/table.service';

@Component({
  selector: 'app-select-documents',
  templateUrl: './select-documents.component.html',
  styleUrls: ['./select-documents.component.css'],
})
export class SelectDocumentsComponent implements OnInit {
  selectedPromo!: string;
  selectedClass!: string;
  selectedCours!: string;
  selectedCoursType!: string;
  arrPath: string[];
  documentsSnap: any;

  description = '';
  load = 'download';

  triName!: string;
  triType!: string;
  triLike!: string;

  public progress = 0;
  public folderinit = '';

  constructor(
    private router: ActivatedRoute,
    private afs: AngularFirestore,
    private route: Router,
    private afAuth: AngularFireAuth,
    private tableService: TableService,
    public appComponent: AppComponent
  ) {
    this.arrPath = new Array<string>();
  }

  ngOnInit(): void {
    this.arrPath = decodeURI(this.route.url.substring(1)).split('/');
    this.router.params.subscribe((params) => {
      this.selectedPromo = params['promo'];
      this.selectedClass = params['class'];
      this.selectedCours = params['cours'];
      this.selectedCoursType = params['coursType'];
      this.folderinit =
        this.selectedPromo +
        '/' +
        this.selectedClass +
        '/' +
        this.selectedCours +
        '/' +
        this.selectedCoursType;
    });
    this.afs
      .collection(
        'efrei/' +
          this.selectedPromo +
          '/class/' +
          this.selectedClass +
          '/cours/' +
          this.selectedCours +
          '/coursType/' +
          this.selectedCoursType +
          '/documents'
      )
      .ref.get()
      .then((data) => (this.documentsSnap = data.docs));
    console.log(this.documentsSnap);
    this.getLike();
    this.getDisslike();
    this.triName = 'asc';
    this.triType = 'asc';
    this.triLike = 'asc';
  }

  public displaySize(size: number) {
    if (size >= 1000000000) {
      return size / 1000000000.0 + ' Go';
    } else if (size >= 1000000) {
      return size / 1000000.0 + ' Mo';
    } else if (size >= 1000) {
      return size / 1000.0 + ' Ko';
    }
    return size + ' o';
  }

  async pageTokenExample(folder: string, folderinit: string) {
    this.tableService.pageTokenExample(folder, folderinit);
  }

  uploading(event: any) {
    console.log(event);
    const allFile = event.target.files;
    this.submiteUploadFormPictures(allFile);
  }

  submiteUploadFormPictures(allFile: Array<any>): void {
    if (this.appComponent.user) {
      console.log(allFile);
      const date = new Date();
      const dateUpload = date.getTime();
      let index = -1;
      for (const file of allFile) {
        index++;
        // Create a root reference
        const storageRef = firebase.storage().ref();

        // Create the file metadata
        const metadata = {
          contentType: 'image/jpeg/gif/png/txt',
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        let filePath = '';
        if (file.webkitRelativePath) {
          filePath = file.webkitRelativePath.slice(
            0,
            file.webkitRelativePath.lastIndexOf('/')
          );
        }
        //var filePath = allFile[0].webkitRelativePath.slice(0,allFile[0].webkitRelativePath.lastIndexOf('/'))
        console.log(index);
        console.log(file.webkitRelativePath);
        console.log(filePath);
        const uploadTask = storageRef
          .child(
            this.folderinit +
              '/' +
              dateUpload +
              '' +
              this.appComponent.user.email +
              '/' +
              filePath +
              '/' +
              file.name
          )
          .put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          (snapshot: any) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            this.progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + this.progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          },
          (error: any) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL: any) => {
                console.log('File available at', downloadURL);
                const ref = this.afs
                  .collection('efrei')
                  .doc(this.selectedPromo)
                  .collection('class')
                  .doc(this.selectedClass)
                  .collection('cours')
                  .doc(this.selectedCours)
                  .collection('coursType')
                  .doc(this.selectedCoursType)
                  .collection('documents')
                  .doc(
                    dateUpload.toString() + '' + this.appComponent.user!.email
                  );

                ref
                  .set(
                    {
                      path:
                        this.folderinit +
                        '/' +
                        dateUpload.toString() +
                        '' +
                        this.appComponent.user!.email,
                      name: file.webkitRelativePath.split('/')[0],
                      type: 'folder',
                      description: this.description,
                      username: this.appComponent.user!.email,
                      like: false,
                      disslike: false,
                      numberLike: 0,
                      numberDisslike: 0,
                    },
                    { merge: true }
                  )
                  .then(() => {
                    uploadTask.snapshot.ref.getMetadata().then((metadata) => {
                      this.setUploadName(
                        ref,
                        file.webkitRelativePath,
                        dateUpload.toString() +
                          '' +
                          this.appComponent.user!.email,
                        metadata.size
                      );
                      this.ngOnInit();
                    });
                  });
                this.afAuth.currentUser.then((user) => {
                  const ref2 = this.afs
                    .collection('users')
                    .doc(user!.uid)
                    .collection('upload')
                    .doc(
                      dateUpload.toString() + '' + this.appComponent.user!.email
                    )
                    .set(
                      {
                        path:
                          this.folderinit +
                          '/' +
                          dateUpload.toString() +
                          '' +
                          this.appComponent.user!.email,
                        name: file.webkitRelativePath.split('/')[0],
                        type: 'folder',
                        description: this.description,
                        username: this.appComponent.user!.email,
                        like: false,
                        disslike: false,
                        numberLike: 0,
                        numberDisslike: 0,
                      },
                      { merge: true }
                    );
                });
              });
          }
        );
      }
    }
  }

  setUploadName(
    ref: AngularFirestoreDocument<firebase.firestore.DocumentData>,
    filePath: string,
    date: string,
    size: number
  ) {
    const allNameFolder: string[] = filePath.split('/');
    let refUpdate = ref;
    let index = 0;
    let path = this.folderinit + '/' + date;
    for (const nameFolder of allNameFolder) {
      path = path + '/' + nameFolder;
      if (index < allNameFolder.length - 1) {
        refUpdate
          .collection('folder')
          .doc(nameFolder)
          .set(
            {
              path: path,
              name: nameFolder,
              type: 'folder',
              size: firebase.firestore.FieldValue.increment(0),
              username: this.appComponent.user!.email,
            },
            { merge: true }
          );
        refUpdate = refUpdate.collection('folder').doc(nameFolder);
      } else {
        refUpdate.collection('file').doc(nameFolder).set(
          {
            path: path,
            name: nameFolder,
            type: 'file',
            size: size,
            username: this.appComponent.user!.email,
          },
          { merge: true }
        );
        refUpdate = refUpdate.collection('folder').doc(nameFolder);
      }
      index++;
    }
    let index2 = 0;
    let refUpdate2 = ref;
    let path2 = this.folderinit + '/' + date;
    for (const nameFolder of allNameFolder) {
      path2 = path2 + '/' + nameFolder;
      if (index2 < allNameFolder.length - 1) {
        console.log('update');
        console.log(nameFolder);
        console.log(size);
        refUpdate2
          .collection('folder')
          .doc(nameFolder)
          .set(
            {
              path: path2,
              size: firebase.firestore.FieldValue.increment(size),
            },
            { merge: true }
          );
        refUpdate2 = refUpdate2.collection('folder').doc(nameFolder);
      }
      index2++;
    }

    this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(this.selectedCoursType)
      .collection('documents')
      .doc(date)
      .update({
        size: firebase.firestore.FieldValue.increment(size),
      });
  }

  changeload() {
    if (this.load === 'download') {
      this.load = 'upload';
    } else if (this.load === 'upload') {
      this.load = 'download';
    }
  }

  handleFileInput(event: any): void {
    const allFile = Array.from(event.target.files);
    this.submiteUploadForm(allFile);
  }

  submiteUploadForm(allFile: Array<any>): void {
    if (this.appComponent.user) {
      const date = new Date();
      const dateUpload = date.getTime();
      allFile.forEach((file) => {
        // Create a root reference
        const storageRef = firebase.storage().ref();

        // Create the file metadata
        const metadata = {
          contentType: 'image/jpeg/gif/png/txt',
        };
        const date = new Date();
        // Upload file and metadata to the object 'images/mountains.jpg'
        const uploadTask = storageRef
          .child(
            this.folderinit +
              '/' +
              dateUpload +
              '' +
              this.appComponent.user!.email +
              '/' +
              file.name
          )
          .put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            this.progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + this.progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            console.log(error);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              const ref = this.afs
                .collection('efrei')
                .doc(this.selectedPromo)
                .collection('class')
                .doc(this.selectedClass)
                .collection('cours')
                .doc(this.selectedCours)
                .collection('coursType')
                .doc(this.selectedCoursType)
                .collection('documents')
                .doc(
                  dateUpload.toString() + '' + this.appComponent.user!.email
                );

              ref
                .set(
                  {
                    path:
                      this.folderinit +
                      '/' +
                      dateUpload.toString() +
                      '' +
                      this.appComponent.user!.email,
                    name: file.name,
                    type: 'file',
                    description: this.description,
                    size: file.size,
                    username: this.appComponent.user!.email,
                    like: false,
                    disslike: false,
                    numberLike: 0,
                    numberDisslike: 0,
                  },
                  { merge: true }
                )
                .then(() => {
                  uploadTask.snapshot.ref.getMetadata().then((metadata) => {
                    ref
                      .collection('file')
                      .doc(file.name)
                      .set(
                        {
                          path:
                            this.folderinit +
                            '/' +
                            dateUpload.toString() +
                            '' +
                            this.appComponent.user!.email +
                            '/' +
                            file.name,
                          name: file.name,
                          type: 'file',
                          size: file.size,
                          username: this.appComponent.user!.email,
                        },
                        { merge: true }
                      )
                      .then(() => {
                        this.ngOnInit();
                      });
                  });
                });
              this.afAuth.currentUser.then((user) => {
                const ref2 = this.afs
                  .collection('users')
                  .doc(user!.uid)
                  .collection('upload')
                  .doc(
                    dateUpload.toString() + '' + this.appComponent.user!.email
                  )
                  .set(
                    {
                      path:
                        this.folderinit +
                        '/' +
                        dateUpload.toString() +
                        '' +
                        this.appComponent.user!.email,
                      name: file.name,
                      type: 'file',
                      description: this.description,
                      size: file.size,
                      username: this.appComponent.user!.email,
                      like: false,
                      disslike: false,
                      numberLike: 0,
                      numberDisslike: 0,
                    },
                    { merge: true }
                  );
              });
            });
          }
        );
      });
    }
  }

  popUpDescriptionSize(desc: string) {
    this.tableService.popUpDescriptionSize(desc);
  }

  like(docid: string) {
    const ref = this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(this.selectedCoursType)
      .collection('documents')
      .doc(docid);

    ref
      .collection('like')
      .doc(this.appComponent.user!.email)
      .ref.get()
      .then((docs) => {
        if (!docs.exists) {
          ('doc exist');
          ref.collection('like').doc(this.appComponent.user!.email).set({});
          ref
            .update({
              numberLike: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              this.ngOnInit();
            });
          for (let docSnap of this.documentsSnap) {
            if (docSnap.id === docid) {
              docSnap.like = true;
            }
          }
          this.afAuth.currentUser.then((user) => {
            const ref2 = this.afs
              .collection('users')
              .doc(user!.uid)
              .collection('upload')
              .doc(docid)
              .update({
                numberLike: firebase.firestore.FieldValue.increment(1),
              });
          });
        } else {
          ref.collection('like').doc(this.appComponent.user!.email).delete();
          ref
            .update({
              numberLike: firebase.firestore.FieldValue.increment(-1),
            })
            .then(() => {
              this.ngOnInit();
            });
          for (let docSnap of this.documentsSnap) {
            if (docSnap.id === docid) {
              docSnap.like = false;
            }
          }
          this.afAuth.currentUser.then((user) => {
            const ref2 = this.afs
              .collection('users')
              .doc(user!.uid)
              .collection('upload')
              .doc(docid)
              .update({
                numberLike: firebase.firestore.FieldValue.increment(-1),
              });
          });
        }
      });
    this.ngOnInit();
  }

  disslike(docid: string) {
    const ref = this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(this.selectedCoursType)
      .collection('documents')
      .doc(docid);
    ref
      .collection('disslike')
      .doc(this.appComponent.user!.email)
      .ref.get()
      .then((docs) => {
        if (!docs.exists) {
          ref.collection('disslike').doc(this.appComponent.user!.email).set({});
          ref
            .update({
              numberDisslike: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              this.ngOnInit();
            });
          for (let docSnap of this.documentsSnap) {
            if (docSnap.id === docid) {
              docSnap.disslike = true;
            }
          }
          this.afAuth.currentUser.then((user) => {
            const ref2 = this.afs
              .collection('users')
              .doc(user!.uid)
              .collection('upload')
              .doc(docid)
              .update({
                numberDisslike: firebase.firestore.FieldValue.increment(1),
              });
          });
        } else {
          ref
            .collection('disslike')
            .doc(this.appComponent.user!.email)
            .delete();
          ref
            .update({
              numberDisslike: firebase.firestore.FieldValue.increment(-1),
            })
            .then(() => {
              this.ngOnInit();
            });
          for (let docSnap of this.documentsSnap) {
            if (docSnap.id === docid) {
              docSnap.disslike = false;
            }
          }
          this.afAuth.currentUser.then((user) => {
            const ref2 = this.afs
              .collection('users')
              .doc(user!.uid)
              .collection('upload')
              .doc(docid)
              .update({
                numberDisslike: firebase.firestore.FieldValue.increment(-1),
              });
          });
        }
      });
  }

  getLike() {
    const ref = this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(this.selectedCoursType)
      .collection('documents');

    ref.ref.get().then((docs) => {
      docs.forEach((doc) => {
        ref
          .doc(doc.id)
          .collection('like')
          .ref.get()
          .then((docs2) => {
            docs2.forEach((doc2) => {
              console.log(doc2.id);
              if (doc2.id === this.appComponent.user!.email) {
                for (let docSnap of this.documentsSnap) {
                  console.log(doc.id);
                  if (docSnap.id === doc.id) {
                    docSnap.like = true;
                  }
                }
              }
            });
          });
      });
    });
  }

  getDisslike() {
    const ref = this.afs
      .collection('efrei')
      .doc(this.selectedPromo)
      .collection('class')
      .doc(this.selectedClass)
      .collection('cours')
      .doc(this.selectedCours)
      .collection('coursType')
      .doc(this.selectedCoursType)
      .collection('documents');

    ref.ref.get().then((docs) => {
      docs.forEach((doc) => {
        ref
          .doc(doc.id)
          .collection('disslike')
          .ref.get()
          .then((docs2) => {
            docs2.forEach((doc2) => {
              console.log(doc2.id);
              if (doc2.id === this.appComponent.user!.email) {
                for (let docSnap of this.documentsSnap) {
                  console.log(doc.id);
                  if (docSnap.id === doc.id) {
                    docSnap.disslike = true;
                  }
                }
              }
            });
          });
      });
    });
  }

  sortByType() {
    if (this.triType === 'asc') {
      this.documentsSnap = null;
      this.afs
        .collection(
          'efrei/' +
            this.selectedPromo +
            '/class/' +
            this.selectedClass +
            '/cours/' +
            this.selectedCours +
            '/coursType/' +
            this.selectedCoursType +
            '/documents'
        )
        .ref.orderBy('type', 'asc')
        .get()
        .then((data) => (this.documentsSnap = data.docs));
      this.triType = 'desc';
    } else if (this.triType === 'desc') {
      this.documentsSnap = null;
      this.afs
        .collection(
          'efrei/' +
            this.selectedPromo +
            '/class/' +
            this.selectedClass +
            '/cours/' +
            this.selectedCours +
            '/coursType/' +
            this.selectedCoursType +
            '/documents'
        )
        .ref.orderBy('type', 'desc')
        .get()
        .then((data) => (this.documentsSnap = data.docs));
      this.triType = 'asc';
    }
  }

  sortByName() {
    if (this.triName === 'asc') {
      this.documentsSnap = null;
      this.afs
        .collection(
          'efrei/' +
            this.selectedPromo +
            '/class/' +
            this.selectedClass +
            '/cours/' +
            this.selectedCours +
            '/coursType/' +
            this.selectedCoursType +
            '/documents'
        )
        .ref.orderBy('name', 'asc')
        .get()
        .then((data) => (this.documentsSnap = data.docs));
      this.triName = 'desc';
    } else if (this.triName === 'desc') {
      this.documentsSnap = null;
      this.afs
        .collection(
          'efrei/' +
            this.selectedPromo +
            '/class/' +
            this.selectedClass +
            '/cours/' +
            this.selectedCours +
            '/coursType/' +
            this.selectedCoursType +
            '/documents'
        )
        .ref.orderBy('name', 'desc')
        .get()
        .then((data) => (this.documentsSnap = data.docs));
      this.triName = 'asc';
    }
  }

  sortByLike() {
    if (this.triLike === 'asc') {
      this.documentsSnap = null;
      this.afs
        .collection(
          'efrei/' +
            this.selectedPromo +
            '/class/' +
            this.selectedClass +
            '/cours/' +
            this.selectedCours +
            '/coursType/' +
            this.selectedCoursType +
            '/documents'
        )
        .ref.orderBy('numberLike', 'asc')
        .get()
        .then((data) => (this.documentsSnap = data.docs));
      this.triLike = 'desc';
    } else if (this.triLike === 'desc') {
      this.documentsSnap = null;
      this.afs
        .collection(
          'efrei/' +
            this.selectedPromo +
            '/class/' +
            this.selectedClass +
            '/cours/' +
            this.selectedCours +
            '/coursType/' +
            this.selectedCoursType +
            '/documents'
        )
        .ref.orderBy('numberLike', 'desc')
        .get()
        .then((data) => (this.documentsSnap = data.docs));
      this.triLike = 'asc';
    }
  }
}
