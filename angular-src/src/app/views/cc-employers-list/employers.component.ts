import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'employers.component.html'
})
export class EmployersComponent {

  busy: Subscription;

  employersInfo: any;
  search: any;
  constructor(
    private crudService: CrudService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("employers").subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        this.employersInfo = data.employers;
        // console.log(this.employersInfo);
      }
    });
  }

  onViewEmployer(employer){
    // localStorage.setItem("employerid", employer._id);
    this.route.navigate(['/cc-employers-list/employersview/' + employer._id]);
  }

}
