import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-extrude-group-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './extrude-group-modal.component.html',
  styleUrls: ['./extrude-group-modal.component.scss']
})
export class ExtrudeGroupModalComponent {
  groupsList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  colorsList: string[] = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
    '#00FFFF', '#800000', '#808000', '#008080', '#800080', '#000080'
  ];

  selectedGroup: number | null = null;
  selectedColor: string | null = null;
  height: number | null = null;

  constructor(public dialogRef: MatDialogRef<ExtrudeGroupModalComponent>) {}

  confirm(): void {
    this.dialogRef.close({
      group: this.selectedGroup,
      color: this.selectedColor,
      height: this.height
    });
  }

  isFormValid(): boolean {
    return this.selectedGroup !== null && this.selectedColor !== null && this.height !== null;
  }
}






