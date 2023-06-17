import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const users: any[] = JSON.parse(localStorage.getItem("usersKey")!) || [];
if (!users.length) {
  users.push({
    userId: "test",
    pass: "test",
    refreshTokens: []
  });
  localStorage.setItem("usersKey", JSON.stringify(users));
}


@Injectable()
export class CallsInterceptorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("request", request);
    switch (request.url) {
      case "/assets/login":
        return registerOrLogin(request.body);
        break;
      case "/assets/refresh":
        return refresh(request.body);
        break;

      default:
        return next.handle(request);
    }

    function registerOrLogin(reqObj: any): Observable<any> {
      console.log("reqObj",reqObj);
      
      let currentUser = users.find((item: any) => item.userId === reqObj.userId && item.pass === reqObj.pass);
      console.log("currentUser",currentUser);
      
      currentUser.refreshTokens.push(generateRefreshToken());
      localStorage.setItem("usersKey", JSON.stringify(users));
      if (!currentUser) {
        return error('Invalid Credentials')
      } else {
        return ok({
          userId: reqObj.userId,
          pass: reqObj.pass,
          jwtToken: generateToken()
        })
      }
    }

    function refresh(reqObj: any): Observable<any> {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return error('You are not authorised');
      }

      let currentUser = users.find(x => x.refreshTokens.includes(refreshToken));
      console.log("currentUser",currentUser);
      currentUser.refreshTokens = currentUser.refreshTokens.filter((x: any) => x !== refreshToken);
      currentUser.refreshTokens.push(generateRefreshToken());
      localStorage.setItem("usersKey", JSON.stringify(users));
      if (!currentUser) {
        return error('You are not authorised')
      } else {
        return ok({
          userId: reqObj.userId,
          pass: reqObj.pass,
          jwtToken: generateToken()
        })
      }
    }

    function getRefreshToken() {
      const cookie = localStorage.getItem('fakeRefreshTokenCookie');
      return (cookie?.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
    }

    function generateRefreshToken() {
      const token = new Date().getTime().toString();
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      localStorage.setItem('fakeRefreshTokenCookie', `fakeRefreshToken=${token}; expires=${expires}; path=/`);
      return token;
    }

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message: string) {
      return throwError(() => ({ error: { message } }));
    }

    function generateToken() {
      let tokenData = { data: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000) };
      return btoa(JSON.stringify(tokenData));
    }
  }
}
