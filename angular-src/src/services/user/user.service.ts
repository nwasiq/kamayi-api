import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpInterceptor } from '../httpInterceptor';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isProd: boolean = environment.production;
  localhostString: string;
  headers: any;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  userLogin(user) {
    return this.http.post(this.localhostString + 'users/login', user, { headers: this.headers })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    window.localStorage.clear();
  }
}
