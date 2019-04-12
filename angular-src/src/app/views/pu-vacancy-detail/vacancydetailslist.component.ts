import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'vacancydetailslist.component.html'
})
export class VacancydetailslistComponent {

  vacancyId: any;
  hired: number;
  openings: number;
  occupation: string;
  employer: string;

  candidatesInfo = [
    {id: '1', candidateName: 'Ahmed Ilyas', skill: 'Electrician', location: 'Islamabad', contactNo: '03331234567', cnic: '1730112345678', status: 'Interviewed'},
    {id: '2', candidateName: 'Osaka Batteries', skill: 'Mechanic', location: 'Lahore', contactNo: '03001234567', cnic: '1730112345678', status: 'Hired'},
    {id: '3', candidateName: 'Ahmed Ilyas', skill: 'Electrician', location: 'Peshawar', contactNo: '03451234567', cnic: '1730112345678', status: 'Rejected'}
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private crudService: CrudService
  ) { }

  ngOnInit(){

    this.activatedRoute.params.subscribe( params =>
      this.vacancyId = params['id']
    );
    
    this.crudService.retrieveOne("vacancys",this.vacancyId).subscribe(data => {
      if(data.message){
        alert(data.message);
        this.route.navigate(['/pu-open-vacancy/openvacancy']);
      }
      else
      {
        this.crudService.retrieveOne("employers", data.employer).subscribe(data2 => {
          this.occupation = data.occupation;
          this.employer = data2.companyName;
          this.hired = data.hired;
          this.openings = data.openings;
        })
      }
    })
  }

  viewManageVacancy(){
    this.route.navigate(['/pu-vacancy-detail/managecriteria/' + this.vacancyId]);
  }
}
