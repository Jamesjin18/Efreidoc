import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat/app';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { getDownloadURL, getStorage, list, ref } from 'firebase/storage';
import { fileToZip } from '../models/listFileToZip';
import * as JSZip from 'jszip';
import { FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';

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
  description: string = '';
  load: string = 'download';

  public progress = 0;
  public folderinit = '';
  public folder: any = null;
  documentsSnap: any;
  jsonHeader = 'application/json; odata=verbose';
  headersOld = new Headers({
    'Content-Type': this.jsonHeader,
    Accept: this.jsonHeader,
  });
  headers = { 'Content-Type': this.jsonHeader, Accept: this.jsonHeader };
  title = 'uploadtest';
  public progressFile = 0;
  public numberFiles = 0;
  public downloadProgress = 0;

  errorMessage = '';
  signInForm!: FormGroup;
  authStatus: boolean | undefined;
  public hovered = false;

  public isAuth = false;

  public url = '';

  public filesArray = [];

  public links: string[] = [];

  public listFileToZip: fileToZip[] = [];
  public finish: number[] = [];

  constructor(private router: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit(): void {
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
  }

  displaySize(size: number) {
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
    console.log(folder);
    console.log(folderinit);
    this.finish.push(0);
    const storage = getStorage();
    const listRef = ref(storage, folder);

    const firstPage = await list(listRef, { maxResults: 100 });
    console.log(firstPage);
    for (let folders of firstPage.prefixes) {
      this.pageTokenExample(folders.fullPath, folderinit);
    }
    for (let file of firstPage.items) {
      this.listFileToZip.push({
        path: file.fullPath,
        name: file.name,
      });
    }
    this.finish.pop();
    if (this.finish.length === 0) {
      console.log('fini');
      console.log(this.listFileToZip);
      if (this.listFileToZip.length === 0) {
        this.downloadBlobFile(
          folder,
          folderinit[folderinit.length - 1] === '/'
            ? folderinit
            : folderinit + '/'
        );
      } else {
        this.downloadBlob(
          folderinit[folderinit.length - 1] === '/'
            ? folderinit
            : folderinit + '/'
        );
      }
    }
  }

  downloadBlobFile(folder: string, folderinit: string) {
    const storage = getStorage();
    const zip = new JSZip();
    const docRef = ref(storage, folder);
    getDownloadURL(docRef)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
          console.log(blob);
          let file = folder.replace(folderinit, '');
          console.log(file);
          zip.file(file, blob);
          var that = this;
          console.log('in');
          zip
            .generateAsync({ type: 'blob' }, function updateCallback(metadata) {
              console.log(metadata.percent);
              that.downloadProgress = metadata.percent;
            })
            .then(function (content: any) {
              console.log('fini');
              FileSaver.saveAs(content, 'file.zip');
              that.listFileToZip = [];
            })
            .catch((error) => {
              console.log(error);
            });
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  downloadBlob(folderinit: string) {
    const storage = getStorage();
    const zip = new JSZip();
    var index = 0;

    for (let doc of this.listFileToZip) {
      console.log('ici');
      console.log(doc);
      const docRef = ref(storage, doc.path);
      getDownloadURL(docRef)
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
            console.log(blob);
            let folder = doc.path.replace(folderinit, '');
            console.log(folder);
            zip.file(folder, blob);
            index++;
            console.log(index, this.listFileToZip.length);
            if (index === this.listFileToZip.length) {
              var that = this;
              console.log('in');
              zip
                .generateAsync(
                  { type: 'blob' },
                  function updateCallback(metadata) {
                    console.log(metadata.percent);
                    that.downloadProgress = metadata.percent;
                  }
                )
                .then(function (content: any) {
                  console.log('fini');
                  FileSaver.saveAs(content, 'file.zip');
                  that.listFileToZip = [];
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          };
          xhr.open('GET', url);
          xhr.send();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  uploading(event: any) {
    console.log(event);
    var allFile = event.target.files;
    this.submiteUploadFormPictures(allFile);
  }

  submiteUploadFormPictures(allFile: Array<any>): void {
    console.log(allFile);
    const date = new Date();
    const dateUpload = date.getTime();
    let index = -1;
    for (let file of allFile) {
      index++;
      // Create a root reference
      const storageRef = firebase.storage().ref();

      // Create the file metadata
      const metadata = {
        contentType: 'image/jpeg/gif/png/txt',
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      if (file.webkitRelativePath) {
        var filePath = file.webkitRelativePath.slice(
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
          this.folderinit + '/' + dateUpload + '/' + filePath + '/' + file.name
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: any) => {
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
              .doc(dateUpload.toString());

            ref
              .set(
                {
                  path: this.folderinit + '/' + dateUpload.toString(),
                  name: file.webkitRelativePath.split('/')[0],
                  type: 'folder',
                  description: this.description,
                },
                { merge: true }
              )
              .then(() => {
                uploadTask.snapshot.ref.getMetadata().then((metadata) => {
                  this.setUploadName(
                    ref,
                    file.webkitRelativePath,
                    dateUpload.toString(),
                    metadata.size
                  );
                });
              });
          });
        }
      );
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
    for (let nameFolder of allNameFolder) {
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
    for (let nameFolder of allNameFolder) {
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
    var allFile = Array.from(event.target.files);
    this.submiteUploadForm(allFile);
  }

  submiteUploadForm(allFile: Array<any>): void {
    const date = new Date();
    const dateUpload = date.getTime();
    if (true) {
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
          .child(this.folderinit + '/' + dateUpload + '/' + file.name)
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
                .doc(dateUpload.toString());

              ref
                .set(
                  {
                    path: this.folderinit + '/' + dateUpload.toString(),
                    name: file.name,
                    type: 'file',
                    description: this.description,
                    size: file.size,
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
                            '/' +
                            file.name,
                          name: file.name,
                          type: 'file',
                          size: file.size,
                        },
                        { merge: true }
                      );
                  });
                });
            });
          }
        );
      });
    }
  }
}
