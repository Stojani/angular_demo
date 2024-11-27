import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-group-extrusion-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, FormsModule, MatButtonModule],
  templateUrl: './reset-group-extrusion-modal.component.html',
  styleUrl: './reset-group-extrusion-modal.component.scss'
})
export class ResetGroupExtrusionModalComponent {
  groupsList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectedGroup: number | null = null;

  constructor(public dialogRef: MatDialogRef<ResetGroupExtrusionModalComponent>) {}

  confirm(): void {
    this.dialogRef.close({
      group: this.selectedGroup
    });
  }

  isFormValid(): boolean {
    return this.selectedGroup !== null;
  }

}
