import { Component } from '@angular/core';

@Component({
  templateUrl: 'bulkcandidatesview.component.html'
})
export class BulkcandidatesviewComponent {

  constructor() { }

  markers: marker[] = []

  zoom: number = 15;

  lat: number = 33.6844;
  lng: number = 73.0479;
  locationChosen = false;

  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
    console.log(this.markers);
  }
}

interface marker {
	lat: number;
	lng: number;
}
