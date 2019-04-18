import { Component } from '@angular/core';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { PagerService } from '../../../services/pager.service';

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

  pager: any = {};
  pagedItems: any[];

  candidatesInfo: any;

  constructor(
    private crudService: CrudService,
    private bulkCandidateService: BulkCandidateService,
    private _flashMessagesService: FlashMessagesService,
    private pagerService: PagerService,
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
        this.setPage(1);
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

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.candidatesInfo.length, page);

    // get current page of items
    this.pagedItems = this.candidatesInfo.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
