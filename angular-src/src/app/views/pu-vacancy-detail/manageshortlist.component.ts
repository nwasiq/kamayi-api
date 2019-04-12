import { Component } from '@angular/core';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: 'manageshortlist.component.html'
})
export class ManageshortlistComponent {

  vacancyId: any;

  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private vacancyService: VacancyService
  ) { }

  candidatesInfo: any[] = [];

  sortBy = ["education", "experience", "location", "none"];

  ngOnInit(){
    this.activatedRoute.params.subscribe( params =>
      this.vacancyId = params['id']
    );

    this.vacancyService.getShortListForVacancy(this.vacancyId).subscribe(data => {
      if(data.length == 0){
        alert("No candidates are shortlisted.");
        return;
      }
      this.candidatesInfo = data;
      console.log(data);
    });
  }

}
