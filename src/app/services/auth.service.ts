import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';


class User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  jwtToken?: string;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private userSubject!: BehaviorSubject<User | null>;
  public user!: Observable<User | null>;

  constructor(
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  

  login(loginData: any) {
    return this.http.post("/assets/login", loginData).pipe(map(user => {
      this.userSubject.next(user);
      this.startRefreshTokenTimer();
      return user;
    }));
  }

  refreshToken() {
    return this.http.post(`/assets/refresh`, {}).pipe(map(user => {
      this.userSubject.next(user);
      this.startRefreshTokenTimer();
      return user;
    }));
  }


  private startRefreshTokenTimer() {
    console.log("this.userValue",this.userValue);
    
    const jwtBase64 :any = this.userValue!.jwtToken;
    const jwtToken = JSON.parse(atob(jwtBase64));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

}
