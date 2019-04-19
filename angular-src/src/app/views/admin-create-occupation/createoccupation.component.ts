import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import {Sort} from '@angular/material';

@Component({
  templateUrl: 'createoccupation.component.html'
})
export class CreateoccupationComponent {

  busy: Subscription;
  sortedData: any[];

  occupation: string;

  occupationsInfo: any;
  search: any;
  constructor(
    private route: Router,
    private crudService: CrudService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
    this.busy = this.crudService.retrieveAll("occupations").subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        this.occupationsInfo = data.occupations;
        this.sortedData = this.occupationsInfo.slice();
      }
    });
  }

  onCreateOccupation(){
    let occupation = {name: this.occupation};
    this.busy = this.crudService.create(occupation, 'occupations').subscribe(data => {
      // alert("Occupation "+ data.name+" created.");
      this._flashMessagesService.show("Occupation "+ data.name+" created.", { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function(){ 
        location.reload(); 
      }, 1000);
    });
  }

  onDeleteOccupation(occupation){
    this.busy = this.crudService.delete("occupations", occupation._id).subscribe(data => {
      // alert(data.message);
      this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1500 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function(){ 
        location.reload(); 
      }, 1500);
    });
  }

  sortData(sort: Sort) {
    const data = this.occupationsInfo.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
