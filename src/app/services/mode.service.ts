import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private modeSubject = new Subject<{ mode: string, data?: any }>();

  mode$ = this.modeSubject.asObservable();

  setMode(mode: string, data?: any) {
    this.modeSubject.next({ mode, data });
  }
}