import { Component } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'payment.component.html'
})
export class PaymentComponent {

  public successModal;
  search:any;
  paymentID: number;
  companyID: number;
  companyName: string;
  dateDue: string;
  amountReceived: string;
  dueAmount: string;
  poContact: string;
  contactNumber: string;

  constructor() { }

  paymentInfo = [
    {id: '1', companyName: 'Honda Atlas', dueDate: '01/01/2019', location: 'Islamabad', contactNo: '03331234567', poc: 'Ahmad Ali', amount:'5000', status: 'Paid', action: 'Verify'},
    {id: '2', companyName: 'Osaka Batteries', dueDate: '11/03/2019', location: 'Lahore', contactNo: '03001234567', poc: 'Ilyas Muhammad', amount:'8000', status: 'Unpaid', action: 'Verify'},
    {id: '3', companyName: 'Toyota GLI', dueDate: '21/10/2019', location: 'Peshawar', contactNo: '03451234567', poc: 'Anwar Ali', amount:'15000', status: 'Unpaid', action: 'Verify'},
    {id: '4', companyName: 'Nixon Tyres', dueDate: '31/12/2019', location: 'Karachi', contactNo: '03211234567', poc: 'Syed Ali', amount:'10000', status: 'Pending', action: 'Verify'}
  ];

  onPayment(){
    const verifyPayment = {
      paymentID: this.paymentID,
      companyID: this.companyID,
      companyName: this.companyName,
      dateDue: this.dateDue,
      amountReceived: this.amountReceived,
      dueAmount: this.dueAmount,
      poContact: this.poContact,
      contactNumber: this.contactNumber
    }
    console.log(verifyPayment);
  }
}

