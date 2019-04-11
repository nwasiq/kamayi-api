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

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
  }

  getUnassignedEmployers(){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'employers/unassigned', { headers: headers })
      .map(res => res.json());
  }

  getVacanciesForEmployer(id){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'employers/' + id + '/vacancies', { headers: headers })
      .map(res => res.json());
  }

  createVacancyForEmployer(id, vacancyObj){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.post(this.localhostString + 'employers/' + id + '/vacancies', vacancyObj, { headers: headers })
      .map(res => res.json());
  }
}
