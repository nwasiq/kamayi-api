import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { VacancyService } from '../../../services/vacancy/vacancy.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'openvacancy.component.html'
})
export class OpenvacancyComponent {

  busy: Subscription;

  selectedVacancy: number = 0;

  placementUserID: string;
  assignedVacancy: any = [];
  search: string;

  shortListVacancysIds: any = [];

  status = ['Archived', 'Completed'];

  statusName: string;

  constructor(
    private userService: UserService,
    private route: Router,
    private _flashMessagesService: FlashMessagesService,
    private vacancyService: VacancyService
  ) {}

  checkAll(ev) {
    this.assignedVacancy.forEach(x => x.state = ev.target.checked);
    if(ev.target.checked){
      this.selectedVacancy = this.assignedVacancy.length;
    }
    else
    {
      this.selectedVacancy = 0;
    }
  }

  isAllChecked() {
    return this.assignedVacancy.every(_ => _.state);
  }

  checkBoxClicked(ev){
    if(ev.target.checked){
      this.selectedVacancy += 1;
    }
    else
    {
      this.selectedVacancy -= 1;
    }
  }

  ngOnInit(){

    this.placementUserID = JSON.parse(localStorage.getItem('user'))._id;
    let userid = this.placementUserID;

    this.busy = this.userService.getOpenVacanciesForPlacementUser(userid).subscribe(data => {
      console.log(data);
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        if(data.length == 0)
        {
          // alert("No vacancy created by you");
          this._flashMessagesService.show("No vacancy created by you", { cssClass: 'alert-danger text-center', timeout: 1000 });
          this._flashMessagesService.grayOut(true);
          this.route.navigate(['/pudashboard']);
        }
        else
        {
          this.assignedVacancy = data;
        }
      }
    });
  }

  updateVacancyStatus(){
    if(this.assignedVacancy.length == 0)
    {
      // alert("No candidates to shortlist.");
      this._flashMessagesService.show("No vacancy to shortlist.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      return;
    }
    
    for(let x of this.assignedVacancy){
      if(x.state)
      {
        this.shortListVacancysIds.push(x._id);
      }
    }

    if(this.shortListVacancysIds.length == 0)
    {
      // alert("No candidate selected.");
      this._flashMessagesService.show("No vacancy selected.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      return;
    }

    if(this.statusName == undefined)
    {
      this._flashMessagesService.show("Select status.", { cssClass: 'alert-danger text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      return;
    }

    let updateObj = {
      vacancyIds: this.shortListVacancysIds
    }

    this.busy = this.vacancyService.updateVacancyStatus(updateObj, this.statusName).subscribe(data => {
      this._flashMessagesService.show(data.message, { cssClass: 'alert-success text-center', timeout: 1000 });
      this._flashMessagesService.grayOut(true);
      setTimeout(function(){ 
        location.reload(); 
      }, 1000);
    })
  
    console.log(updateObj);
  }

  viewVacancyDetails(vacancy)
  {
    this.route.navigate(['/pu-vacancy-detail/vacancydetails/' + vacancy._id]);
  }

}
