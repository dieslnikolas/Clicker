import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private currentUserSubject: BehaviorSubject<boolean>;
  public currentUser: Observable<boolean>;

  constructor() {
      this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
      return this.currentUserSubject.value;
  }

  public login(server: string, user: string, password: string): void {
      localStorage.setItem('currentUser', JSON.stringify(user))
  }

  public logout(): void {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
