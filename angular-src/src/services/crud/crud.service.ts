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
  headers: any;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    let token = localStorage.getItem('token');
    this.headers.append('Authorization', token);
  }

  create(obj, model){
    return this.http.post(this.localhostString + model, obj, { headers: this.headers })
      .map(res => res.json());
  }

  retrieveOne(model, id) {
    return this.http.get(this.localhostString + model + '/' + id, { headers: this.headers })
      .map(res => res.json());
  }

  retrieveAll(model) {
    return this.http.get(this.localhostString + model, { headers: this.headers })
      .map(res => res.json());
  }

  update(obj, model, id) {
    return this.http.put(this.localhostString + model + '/' + id, obj, { headers: this.headers })
      .map(res => res.json());
  }

  delete(model, id) {
    return this.http.delete(this.localhostString + model + '/' + id, { headers: this.headers })
      .map(res => res.json());
  }
}
