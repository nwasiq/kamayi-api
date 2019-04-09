import { Component } from '@angular/core';
import { CrudService } from '../../../services/crud/crud.service';
import { BulkCandidateService } from '../../../services/bulkCandidate/bulk-candidate.service';

@Component({
  templateUrl: 'bulkcandidates.component.html'
})
export class BulkcandidatesComponent {

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
    private bulkCandidateService: BulkCandidateService
  ) { }

  ngOnInit(){
    this.crudService.retrieveAll("bulkcandidates").subscribe(data => {
      if(data.message)
      {
        alert(data.message);
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
    console.log(this.fileToUpload);
  }

  onUpload(){
    const formData: any = new FormData();
    let file: File = this.fileToUpload;

    formData.append("excelFile", file, file['name']);
    this.bulkCandidateService.importBulkCandies(formData).subscribe(data => {

        alert(data.message);
        window.location.reload();
      
    });
  }
}
