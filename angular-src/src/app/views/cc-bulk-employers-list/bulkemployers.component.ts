import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';

@Component({
  templateUrl: 'bulkemployers.component.html'
})
export class BulkemployersComponent {

  employersInfo = [
    {id: '1', companyName: 'Honda Atlas', industry: 'Cars', location: 'Islamabad', contactNo: '03331234567', poc: 'Ahmad Ali', status: 'Unassigned'},
    {id: '2', companyName: 'Osaka Batteries', industry: 'Batteries', location: 'Lahore', contactNo: '03001234567', poc: 'Ilyas Muhammad', status: 'Unassigned'},
    {id: '3', companyName: 'Toyota GLI', industry: 'Cars', location: 'Peshawar', contactNo: '03451234567', poc: 'Anwar Ali', status: 'Assigned'}
  ]

  constructor(
    private crudService: CrudService,
    private router: Router,
    private bulkCandidateService: BulkCandidateService
  ) { }

  // ngOnInit(){
  //   this.bulkEmployerService.getBulkCandiesByStatus('false').subscribe(data => {
  //     console.log(data);
  //     if(data.message)
  //     {
  //       alert(data.message);
  //     }
  //     else
  //     {
  //       this.candidatesInfo = data.bulkcandidates;
  //     }
  //   });
  // }

  onViewEmployer(employer){

    // localStorage.setItem("employerid", employer._id);
    this.router.navigate(['/cc-bulk-employers-list/createemployer']);
  }

}
