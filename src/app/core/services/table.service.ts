import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, list, ref } from 'firebase/storage';
import { fileToZip } from '../../models/listFileToZip';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  public downloadProgress = 0;
  public filesArray = [];
  public links: string[] = [];
  public listFileToZip: fileToZip[] = [];
  public finish: number[] = [];

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

  popUpDescriptionSize(desc: string) {
    Swal.fire({
      title: 'Description',
      text: desc,
    });
  }

  async pageTokenExample(folder: string, folderinit: string) {
    console.log('folder: ' + folder);
    console.log('folder init: ' + folderinit);
    this.finish.push(0);
    const storage = getStorage();
    const listRef = ref(storage, folder);

    const firstPage = await list(listRef, { maxResults: 100 });
    console.log('first page: ' + firstPage);
    for (const folders of firstPage.prefixes) {
      this.pageTokenExample(folders.fullPath, folderinit);
    }
    for (const file of firstPage.items) {
      this.listFileToZip.push({
        path: file.fullPath,
        name: file.name,
      });
    }
    this.finish.pop();
    if (this.finish.length === 0) {
      console.log('fini');
      console.log('file to zip: ' + this.listFileToZip);
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
          console.log('blob: ' + blob);
          const file = folder.replace(folderinit, '');
          console.log('file:' + file);
          zip.file(file, blob);
          console.log('in');
          zip
            .generateAsync({ type: 'blob' }, (metadata) => {
              console.log('meta: ' + metadata.percent);
              this.downloadProgress = metadata.percent;
            })
            .then((content: any) => {
              console.log('fini');
              FileSaver.saveAs(content, 'file.zip');
              this.listFileToZip = [];
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
    let index = 0;

    for (const doc of this.listFileToZip) {
      console.log('ici');
      console.log('doc: ' + doc);
      const docRef = ref(storage, doc.path);
      getDownloadURL(docRef)
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
            console.log('blob: ' + blob);
            const folder = doc.path.replace(folderinit, '');
            console.log('folder: ' + folder);
            zip.file(folder, blob);
            index++;
            console.log(index, this.listFileToZip.length);
            if (index === this.listFileToZip.length) {
              console.log('in');
              zip
                .generateAsync({ type: 'blob' }, (metadata) => {
                  console.log('meta: ' + metadata.percent);
                  this.downloadProgress = metadata.percent;
                })
                .then((content: any) => {
                  console.log('fini');
                  FileSaver.saveAs(content, 'file.zip');
                  this.listFileToZip = [];
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
}
