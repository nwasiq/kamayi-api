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
  headers: any;

  constructor(private http: HttpInterceptor) {
    this.localhostString = this.isProd ? "" : "http://localhost:3000/";
    this.headers = new Headers();
    let token = localStorage.getItem('token');
    this.headers.append('Authorization', token);
  }

  importBulkCandies(file) {
    // console.log('import bulk candies', file)
    return this.http.post(this.localhostString + 'bulkcandidates', file, { headers: this.headers })
      .map(res => res.json());
  }

  getBulkCandiesByStatus(status){
    return this.http.get(this.localhostString + 'bulkcandidates/status/' + status, { headers: this.headers })
      .map(res => res.json());
  }
}
