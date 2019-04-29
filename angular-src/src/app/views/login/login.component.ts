import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  busy: Subscription;

  email: string;
  password: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    let token = localStorage.getItem('token');
    if(token){
      let user = JSON.parse(localStorage.getItem('user'));
      if(user['role'] == "placement")
      {
        this.router.navigate(['pudashboard']);
      }
      else if (user['role'] == "callCenter")
      {
        this.router.navigate(['ccdashboard']);
      }
      else
      {
        this.router.navigate(['dashboard']);
      }
    }
  }

  onLoginSubmit(){
    const user = {
      email: this.email,
      password: this.password
    }
    this.busy = this.userService.userLogin(user).subscribe(data => {
      this.userService.storeUserData(data.token, data.user);
      // console.log(JSON.parse(localStorage.getItem('user')));
      // console.log(data);
      if(data['user']['role'] == "placement")
      {
        this.router.navigate(['pudashboard']);
      }
      else if (data['user']['role'] == "callCenter")
      {
        this.router.navigate(['ccdashboard']);
      }
      else
      {
        this.router.navigate(['dashboard']);
      }
    });
  }

}