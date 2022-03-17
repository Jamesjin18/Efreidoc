import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat/app';

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

  public progress = 0;
  public folderinit = '';

  documentsSnap: any;
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
    if(size>=1000000) {
      return size/1000000.0+" Go"
    }else if(size>=1000) {
      return size/1000.0+" Mo"
    }
    return size+" Ko"
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
          'efrei/' +
            this.folderinit +
            '/' +
            dateUpload +
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
                { path: this.folderinit + '/' + dateUpload.toString() },
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
              description: '',
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
            description: '',
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
  }
}
