import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpInterceptor } from '../httpInterceptor';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  isProd: boolean = environment.production;
  localhostString: string;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
  }

  getNotifications(id= false) {
    let possiblePlacementId = JSON.parse(localStorage.getItem('user'))._id;
    let route = id ? 'notifications/placement/' + possiblePlacementId : 'notifications/admin';
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + route, { headers: headers })
      .map(res => res.json());
  }

}
