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

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
  }

  userLogin(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.localhostString + 'users/login', user, { headers: headers })
      .map(res => res.json());
  }

  getPlacementUsers() {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'users/role/placement', { headers: headers })
      .map(res => res.json());
  }

  getEmployersForPlacementUser(id) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'users/placementusers/'+ id +'/employers', { headers: headers })
      .map(res => res.json());
  }

  getDashboardDetails() {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'users/dashboard', { headers: headers })
      .map(res => res.json());
  }

  getDashboardDetailsById(id) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'users/' + id + '/dashboard', { headers: headers })
      .map(res => res.json());
  }

  getOpenVacanciesForPlacementUser(id) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'users/placementusers/' + id + '/vacancies', { headers: headers })
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
