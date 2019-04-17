import { Component } from '@angular/core';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'bulkcandidates.component.html'
})
export class BulkcandidatesComponent {

  busy: Subscription;

  fullName: string;
  cnic: string;
  phone: string;
  dob: string;
  education: string; 
  training: string; 
  experience: number; 
  city: string; 
  email: string;
  primarySkill: string;
  search: any;
  fileToUpload: File;

  candidatesInfo: any;

  constructor(
    private crudService: CrudService,
    private bulkCandidateService: BulkCandidateService,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
    this.busy = this.crudService.retrieveAll("bulkcandidates").subscribe(data => {
      if(data.message)
      {
        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-danger text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
      }
      else
      {
        this.candidatesInfo = data.bulkcandidates;
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    let fileList: FileList = fileInput.target.files;
    this.fileToUpload = fileList[0];
    // console.log(this.fileToUpload);
  }

  onUpload(){
    const formData: any = new FormData();
    let file: File = this.fileToUpload;

    formData.append("excelFile", file, file['name']);
    this.busy = this.bulkCandidateService.importBulkCandies(formData).subscribe(data => {

        // alert(data.message);
        this._flashMessagesService.show(data.message, { cssClass: 'alert-success text-center', timeout: 1000 });
        this._flashMessagesService.grayOut(true);
        setTimeout(function(){ 
          location.reload(); 
        }, 1000);
      
    });
  }
}
