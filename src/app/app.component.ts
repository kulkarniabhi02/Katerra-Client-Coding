import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tableHeadings = [];
  filesToUpload: Array<File>;
  url = 'http://localhost:3000/api/v1';
  excelResponse = [];
  showDisplay = false;
  showClearDisplay = false;

  constructor() {
    this.filesToUpload = [];
  }

  uploadCsvFile() {
    document.getElementById('uploadFile').click();
  }

  displayExcelDetails() {
    const fileName = sessionStorage.getItem('filename');
    const downloadUrl = `${this.url}/data/${fileName}`;
    this.downFileRequest(downloadUrl).then((result: any) => {
      this.excelResponse = result;
      this.showClearDisplay = true;
    }, (error) => {
        console.error(error);
    });
  }

  clearExcelDetails() {
    this.filesToUpload = [];
    this.excelResponse = [];
    this.showDisplay = false;
    this.showClearDisplay = false;
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files as Array<File>;
    const url = `${this.url}/upload_csv`;
    this.uploadFileRequest(url, [], this.filesToUpload).then((result: any) => {
        sessionStorage.setItem('filename', result.id);
        this.showDisplay = result.result;
    }, (error) => {
        console.error(error);
    });
  }

  uploadFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
        const formData: any = new FormData();
        const xhr = new XMLHttpRequest();
        for (let i = 0; i < files.length; i++) {
          formData.append('uploads[]', files[i], files[i].name);
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };
        xhr.open('POST', url, true);
        xhr.send(formData);
    });
  }

  downFileRequest(url: string) {
    return new Promise((resolve, reject) => {
        const formData: any = new FormData();
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send(formData);
    });
  }
}
