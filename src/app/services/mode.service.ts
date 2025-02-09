import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private modeSubject = new Subject<string>();

  mode$ = this.modeSubject.asObservable();

  setMode(mode: string) {
    this.modeSubject.next(mode);
  }
}