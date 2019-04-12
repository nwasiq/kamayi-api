import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpInterceptor } from '../httpInterceptor';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  isProd: boolean = environment.production;
  localhostString: string;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
  }

  getTentativeShortList(vacancyid, uri){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'vacancys/'+ vacancyid + '/tentativeshortlist' + uri, { headers: headers })
      .map(res => res.json());
  }

  getShortListForVacancy(vacancyid){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'vacancys/'+ vacancyid + '/shortlist', { headers: headers })
      .map(res => res.json());
  }

  createShortList(candidatesIDs, vacancyid){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.post(this.localhostString + 'vacancys/'+ vacancyid + '/shortlist',candidatesIDs, { headers: headers })
      .map(res => res.json());
  }

}