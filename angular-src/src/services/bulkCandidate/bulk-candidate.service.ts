import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpInterceptor } from '../httpInterceptor';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BulkCandidateService {

  isProd: boolean = environment.production;
  localhostString: string;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
  }

  importBulkCandies(file) {
    // console.log('import bulk candies', file)
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.post(this.localhostString + 'bulkcandidates', file, { headers: headers })
      .map(res => res.json());
  }

  getBulkCandiesByStatus(status){
    let headers = new Headers();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.get(this.localhostString + 'bulkcandidates/status/' + status, { headers: headers })
      .map(res => res.json());
  }
}
