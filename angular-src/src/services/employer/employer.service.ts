import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpInterceptor } from '../httpInterceptor';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  isProd: boolean = environment.production;
  localhostString: string;
  headers: any;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
    this.headers = new Headers();
    let token = localStorage.getItem('token');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', token);
  }

  getUnassignedEmployers(){
    return this.http.get(this.localhostString + 'employers/unassigned', { headers: this.headers })
      .map(res => res.json());
  }
}
