import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CrudService } from '../../../services/crud/crud.service';

@Component({
  templateUrl: 'createoccupation.component.html'
})
export class CreateoccupationComponent {

  occupation: string;

  occupationsInfo: any;

  constructor(
    private route: Router,
    private crudService: CrudService
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("occupations").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
      }
      else
      {
        this.occupationsInfo = data.occupations;
      }
    });
  }

  onCreateOccupation(){
    let occupation = {name: this.occupation};
    this.crudService.create(occupation, 'occupations').subscribe(data => {
      alert("Occupation "+ data.name+" created.");
      window.location.reload();
    });
  }

  onDeleteOccupation(occupation){
    this.crudService.delete("occupations", occupation._id).subscribe(data => {
      alert(data.message);
      window.location.reload();
    });
  }

}
