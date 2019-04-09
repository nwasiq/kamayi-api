import { Component } from '@angular/core';

@Component({
  templateUrl: 'managecriteria.component.html'
})
export class ManagecriteriaComponent {

  gender: string;
  education: string;
  experience: string;
  city: string;
  location: string;
  unemployed: string;
  educationWeight: string;
  experienceWeight: string;
  locationWeight: string;
  generateWeighted: string;
  
  constructor() { }

  candidatesInfo: any[] = [
    {id: '1', candidateName: 'Ahmed Ilyas', gender:'M', occupation: 'Electrician', city: 'Islamabad', education: '03331234567', relativeExp: '3 Years', status: 'Already Working'},
    {id: '2', candidateName: 'Osaka Batteries', gender:'F', occupation: 'Mechanic', city: 'Lahore', education: '03001234567', relativeExp: '1 Years', status: 'Not Working'},
    {id: '3', candidateName: 'Ahmed Ilyas', gender:'M', occupation: 'Electrician', city: 'Peshawar', education: '03451234567', relativeExp: '3 Years', status: 'Already Working'},
    {id: '4', candidateName: 'Ahmed Ilyas', gender:'M', occupation: 'Electrician', city: 'Islamabad', education: '03331234567', relativeExp: '5 Years', status: 'Not Working'},
    {id: '5', candidateName: 'Osaka Batteries', gender:'F', occupation: 'Mechanic', city: 'Lahore', education: '03001234567', relativeExp: '0 Years', status: 'Already Working'}
  ];

  sortBy = ["Education", "Experience", "city"];

  checkAll(ev) {
    this.candidatesInfo.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    return this.candidatesInfo.every(_ => _.state);
  }

}
