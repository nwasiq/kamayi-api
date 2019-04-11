import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpInterceptor } from '../httpInterceptor';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  isProd: boolean = environment.production;
  localhostString: string;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
  }

  create(obj, model){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.post(this.localhostString + model, obj, { headers: headers })
      .map(res => res.json());
  }

  retrieveOne(model, id) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + model + '/' + id, { headers: headers })
      .map(res => res.json());
  }

  retrieveAll(model) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + model, { headers: headers })
      .map(res => res.json());
  }

  update(obj, model, id) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.put(this.localhostString + model + '/' + id, obj, { headers: headers })
      .map(res => res.json());
  }

  delete(model, id) {
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.delete(this.localhostString + model + '/' + id, { headers: headers })
      .map(res => res.json());
  }
}
