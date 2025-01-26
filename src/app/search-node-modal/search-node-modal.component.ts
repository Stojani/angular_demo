import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-node-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './search-node-modal.component.html',
  styleUrl: './search-node-modal.component.scss'
})
export class SearchNodeModalComponent {
  nodeIdInput: string | null = null;

  constructor(public dialogRef: MatDialogRef<SearchNodeModalComponent>) {}

  confirm(): void {
    this.dialogRef.close({
      nodeId: this.nodeIdInput
    });
  }

  isFormValid(): boolean {
    return !!this.nodeIdInput;
  }

}
