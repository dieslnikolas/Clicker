import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserloginOutput } from './login-output'

@Injectable({ providedIn: 'root' })
export class LoginService {

  private currentUserSubject: BehaviorSubject<UserloginOutput>;
  private currentUser: Observable<UserloginOutput>;

  constructor() {
      this.currentUserSubject = new BehaviorSubject({
          user : JSON.parse(localStorage.getItem('currentUser')),
          server : "dieslnikolas.cz"
      });
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserloginOutput {
      return this.currentUserSubject.value;
  }

  public login(server: string, user: string, password: string): void {
      localStorage.setItem('user', JSON.stringify({ "user" : user, "server": server}))
  }

  public logout(): void {
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
  }
}
