import { Component } from '@angular/core';

@Component({
  templateUrl: 'companyvacancies.component.html'
})
export class CompanyvacanciesComponent {

  vacanciesInfo = [
    {id: '1', vacancyName: 'Electrician Required', skillsetRequired: 'Electrician', location: 'Islamabad', contactNo: '03331234567', slot: '10/500', uploadDate: '1/12/2018'},
    {id: '2', vacancyName: 'Osaka Batteries', skillsetRequired: 'Batteries', location: 'Lahore', contactNo: '03001234567', slot: '40/400', uploadDate: '1/10/2018'},
    {id: '3', vacancyName: 'Electrician Required', skillsetRequired: 'Electrician', location: 'Peshawar', contactNo: '03451234567', slot: '10/500', uploadDate: '1/12/2018'}
  ]

  constructor() { }

}
