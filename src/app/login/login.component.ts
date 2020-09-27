import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { Router } from '../../../node_modules/@angular/router';
import { SocketServiceService } from '../socket-service.service';
import { ToastrService } from 'ngx-toastr';
import {forgotPassword} from './forgotpassword.model';
import { AuthService } from '../auth.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userDetails = {
    email: '',
    password: ''
  }
  forgotEmail: forgotPassword;
  forgotemail: string;
  data: any;
  errorMsg: string;




  constructor(private service: AppserviceService, private router: Router, 
    private socketService: SocketServiceService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit() {
    
  }

  onSubmit() {
    let responseData: any;
    this.service.login(this.userDetails).subscribe(data => {
      console.log(data);
      responseData = data;
      if (responseData.status === 200) {
        localStorage.setItem('authToken', responseData.data.authToken);
        localStorage.setItem('userId', responseData.data.userDetails.userId);
        localStorage.setItem('firstName', responseData.data.userDetails.firstName);
        this.authService.loggedIn = true;
        this.toastr.success('Login Succesful');
        this.router.navigate(['dashboard']);
        let details = {
          authToken: responseData.data.authToken,
          userId: responseData.data.userDetails.userId
        }
        setTimeout(() => {
          this.socketService.getASocketCall(details).subscribe(data => {
            console.log('socket', data);
          })
          
        }, 2000);
      } else {
        console.log(data);
        if(responseData.status === 404) {
          this.toastr.error('No User Details Found');
        } else if(responseData.status === 500) {
          this.toastr.error('No User');
        }
      }
    }, error => {
      this.toastr.error('Email is not exist');

    })
  }

  forgotpassword() {
    $('#regModal').modal('show');
     
}

sendEmail() {
  this.forgotEmail = {email: this.forgotemail};
  this.service.forgotPassword(this.forgotEmail).subscribe(data => {
    this.data = data;
    if(this.data.error) {
      this.errorMsg = this.data.message;
      $('#regModal').modal('hide');
    this.toastr.error('', 'Email is not Registered');
    } else {
      $('#regModal').modal('hide');
  this.toastr.success('Password sent to your email', 'Password Sent');
    }
  });
}

cancel() {
  $('#regModal').modal('hide');
}

}
