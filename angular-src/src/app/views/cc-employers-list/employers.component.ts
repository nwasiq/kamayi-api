import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'employers.component.html'
})
export class EmployersComponent {

  employersInfo: any;
  search: any;
  constructor(
    private crudService: CrudService,
    private route: Router
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("employers").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.employersInfo = data.employers;
        console.log(this.employersInfo);
      }
    });
  }

  onViewEmployer(employer){
    localStorage.setItem("employerid", employer._id);
    this.route.navigate(['/cc-employers-list/employersview/' + employer._id]);
  }

}
