import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-graph-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './upload-graph-modal.component.html',
  styleUrls: ['./upload-graph-modal.component.scss']
})
export class UploadGraphModalComponent {
  file: File | null = null;

  constructor(public dialogRef: MatDialogRef<UploadGraphModalComponent>) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  onUpload() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        this.dialogRef.close(data);
      };
      reader.readAsText(this.file);
    }
  }

}