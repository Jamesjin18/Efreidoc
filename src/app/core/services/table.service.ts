import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, list, ref } from 'firebase/storage';
import { fileToZip } from '../../models/listFileToZip';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  public downloadProgress: number = 0;
  public filesArray = [];
  public links: string[] = [];
  public listFileToZip: fileToZip[] = [];
  public finish: number[] = [];

  percentChange: Subject<number> = new Subject<number>();

  constructor() {
    this.percentChange.subscribe((value) => {
      this.downloadProgress = value;
    });
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

  popUpDescriptionSize(desc: string) {
    Swal.fire({
      title: 'Description',
      text: desc,
    });
  }

  async pageTokenExample(folder: string, folderinit: string) {
    this.finish.push(0);
    const storage = getStorage();
    const listRef = ref(storage, folder);

    const firstPage = await list(listRef, { maxResults: 100 });
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
          const file = folder.replace(folderinit, '');
          zip.file(file, blob);
          zip
            .generateAsync({ type: 'blob' }, (metadata) => {
              this.percentChange.next(metadata.percent);
              metadata.percent === 100 ? this.percentChange.next(0) : '';
            })
            .then((content: any) => {
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
      const docRef = ref(storage, doc.path);
      getDownloadURL(docRef)
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
            const folder = doc.path.replace(folderinit, '');
            zip.file(folder, blob);
            index++;
            if (index === this.listFileToZip.length) {
              zip
                .generateAsync({ type: 'blob' }, (metadata) => {
                  this.percentChange.next(metadata.percent);
                  metadata.percent === 100 ? this.percentChange.next(0) : '';
                })
                .then((content: any) => {
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
