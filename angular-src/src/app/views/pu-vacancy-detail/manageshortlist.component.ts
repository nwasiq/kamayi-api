import { Component } from '@angular/core';

@Component({
  templateUrl: 'manageshortlist.component.html'
})
export class ManageshortlistComponent {

  date: Date = new Date();
  settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd-MM-yyyy',
      defaultOpen: false
  }

  constructor() { }

  candidatesInfo: any[] = [
    {id: '1', candidateName: 'Ahmed Ilyas', skill: 'Electrician', distance: 'Islamabad', education: '03331234567', relativeExp: '3 Years', status: 'Already Working'},
    {id: '2', candidateName: 'Osaka Batteries', skill: 'Mechanic', distance: 'Lahore', education: '03001234567', relativeExp: '1 Years', status: 'Not Working'},
    {id: '3', candidateName: 'Ahmed Ilyas', skill: 'Electrician', distance: 'Peshawar', education: '03451234567', relativeExp: '3 Years', status: 'Already Working'},
    {id: '4', candidateName: 'Ahmed Ilyas', skill: 'Electrician', distance: 'Islamabad', education: '03331234567', relativeExp: '5 Years', status: 'Not Working'},
    {id: '5', candidateName: 'Osaka Batteries', skill: 'Mechanic', distance: 'Lahore', education: '03001234567', relativeExp: '0 Years', status: 'Already Working'}
  ];

  sortBy = ["Education", "Experience", "Location"];

}
