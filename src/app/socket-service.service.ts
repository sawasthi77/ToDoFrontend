import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  private socket = io('http://ec2-13-235-91-77.ap-south-1.compute.amazonaws.com');

  constructor() { }

  public getASocketCall(details) {
   // console.log('this is a socket service');
     //console.log('userid',details);
     return Observable.create((observer) => {
      // console.log('this.authToken', details.authToken);
         this.socket.emit("set-user", details.authToken);
         this.socket.on(details.userId, (data) => {
        //  console.log('DDD', data);
         })
 
     }); // end Observable
 
   } // End getASocketCall

   public exitSocket(userId) {
     //this.socket.disconnect(userId);
     this.socket.emit("disconnect", userId);
   }
   
}
