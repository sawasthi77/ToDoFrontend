import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { SocketServiceService } from '../socket-service.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  userDetails = {
    email: '',
    password: '',
    firstName:'',
    lastName:'',
    mobileNumber:''
  }

  loginDetails = {
      email: '',
      password: ''
  }

  response: any;
  constructor(private service: AppserviceService, 
    private toastr: ToastrService,
    private authService: AuthService,
    private socketService: SocketServiceService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
  if(this.userDetails.email || this.userDetails.password || 
  this.userDetails.firstName || this.userDetails.lastName ||
    this.userDetails.mobileNumber) {
      this.service.signup(this.userDetails).subscribe(data => {
        console.log('signup', data);
         this.response = data;

        if(this.response.status === 200) {
          //this.toastr.success(this.response);
          this.login(this.response);

        } else if(this.response.status === 400) {
            this.toastr.error(this.response.message);

        } else if(this.response.status === 500) {
          this.toastr.error(this.response.message);

        }

        else if(this.response.status === 403) {
          this.toastr.info(this.response.message);
        }
      }, error => {
        this.toastr.error('User Not Found');
      })

    } else {
      this.toastr.error('No User');
    }
  }

  login(signUpResponse: any) {
    let responseData: any;
    this.loginDetails.email = signUpResponse.data.email;
    this.loginDetails.password = this.userDetails.password;
    
    this.service.login(this.loginDetails).subscribe(data => {
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

}
