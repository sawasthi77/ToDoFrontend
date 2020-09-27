import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { Router } from '../../../node_modules/@angular/router';
import { AuthService } from '../auth.service';
import * as io from 'socket.io-client';
import { SocketServiceService } from '../socket-service.service';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private socket = io('https://fast-island-94955.herokuapp.com');

  authToken: string;
  userId: string;

  constructor(private service: AppserviceService, 
    private router: Router, 
    private toastr: ToastrService,
    private socketService: SocketServiceService,
    private authService: AuthService) { }


  ngOnInit() {
  }

  logoutConfirm() {

    this.authToken = localStorage.getItem('authToken');
    this.userId  = localStorage.getItem('userId')

    let userDetails = {
      'authToken': this.authToken,
      'userId': this.userId
    }

    this.service.logout(userDetails).subscribe(data => {
      console.log('logout', data);
      let resData: any = data;
     $('#logoutButton').modal('hide');
      if(resData.error) {
        if(resData.status === 404) {
          this.toastr.error(resData.message);
        this.authService.loggedIn = false;

        } else if(resData.status === 500) {
          this.toastr.error(resData.message);
        this.authService.loggedIn = false;

        }
      } else {
        this.socketService.exitSocket(userDetails.userId);     
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('firstName');
        this.authService.loggedIn = false;
        this.toastr.info('', 'Logout Successfully');
        this.router.navigate(['/login']);

      }
    })
  }

  logout() {

    $('#logoutButton').modal('show');

  }

}
