import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../appservice.service';
import { Router } from '../../../node_modules/@angular/router';
import { AuthGaurd } from '../auth-gaurd.service';
import { AuthService } from '../auth.service';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import * as io from 'socket.io-client';

declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
userList:any;
friendList: any
authToken: string;
userId: string;
friendRequest = [];
friendRequestSend= [];
myFriends= [];
toDoList = [];
historyData = [];
subToDoItem: string;
firstName: string;
userClicked: boolean;
selectedUser: string;
 friendDetails = {
  'requestedById':'',
  'requestedToId':'',
  'status':'',
  'requestedUserDetails': {},
  'requestedByName':'',
  'requestedToName':''
}

toDoDetails = {
  'toDoName': '',
  'toDoItemId':'',
  'toDostatus': '',
  'userId':'',
  'subToDoItems':[],
  'history': [],
  'status': ''
}
eventDetails = {
  title: '',
  recieverUserId: '',
  senderUserId:'',
  userName:''
}

 userDetails = {
  'userId': '',
  'authToken': ''
}

socketURL = io('https://fast-island-94955.herokuapp.com');


  constructor(private service: AppserviceService, 
    private router: Router,
    private toastr: ToastrService,
      private authService: AuthService) {
        this.authService.loggedIn = true;
       }

  ngOnInit() {
    this.userClicked = false;
    this.authToken = localStorage.getItem('authToken');
    this.userId  = localStorage.getItem('userId')
    this.firstName  = localStorage.getItem('firstName')
   this.userDetails.authToken = this.authToken;
   this.userDetails.userId = this.userId;

    this.eventDetails.senderUserId = this.userId;
    setTimeout(() => {
      this.getAllDetails();
      
    }, 2000);

    this.socketURL.on(this.userDetails.userId, (data) => {
      this.friendRequest = [];
      this.friendRequestSend = [];
      this.myFriends = [];
  
         if(data.todo && data.created) {
           if(data.message) {
             this.toastr.success(data.message);
           } else {
             this.toastr.success('Todo Created Succeessful')
           }
  
         } else if (data.todo && data.created === false) {
          if(data.message) {
            this.toastr.success(data.message);
          } else {
            this.toastr.success('Todo Updated Succeessful')
          }
         } 
         
         else {
  
           if(data.requestedById === this.userId && data.status === 'PENDING') {
             this.toastr.success('Friend Request Sent Successfully');
            } else if(data.requestedToId === this.userId && data.status === 'PENDING') {
              this.toastr.success(`A New Friend Request From ${data.requestedByName}`);
            }
            
            if(data.requestedById === this.userId && data.status === 'ACCEPTED') {
              this.toastr.success(`${data.requestedToName} Has Accepted Your Friend Request`);
            } else if(data.requestedToId === this.userId && data.status === 'ACCEPTED'){
              this.toastr.success(`${data.requestedByName} Is Your Friend Now`);
            }
          }
          // console.log('SOCKET DATA', data);
          this.getAllDetails();
    })
    
}


getAllDetails() {
 // console.log('getAllDetails', this.userDetails);

  this.service.getFriendDetails(this.userDetails).subscribe(data => {

    let resData : any;
    resData = data;
    if(resData.status === 200) {
      this.friendList = resData;
      this.createFriendList();
    }
     else if(resData.error) {
       if(resData.status === 404) {
         this.toastr.info('No Friends');
       } 
 
     } else {
     }
 
 
   }, error => {
     //console.log('Getdetails', error);
   })
   
   
   setTimeout(() => {
     this.arrangeFriendsList();
   }, 3000);
   
 this.getToDoListDetails(this.userDetails);

}

getToDoListDetails(userDetails) {
  if(this.userClicked) {
    userDetails.userId = this.selectedUser;
  } else {

  }
this.service.getToDoList(userDetails).subscribe(data => {
  //console.log(data);
  let toDoList: any; 
  toDoList = data;
  if(toDoList.error === true && toDoList.message === 'No User Found') {
    this.toDoList = [];
  } else if(toDoList.error === false){
    //this.toDoList = toDoList.data;
    this.toDoList = [];
    for(let item of toDoList.data) {
        if(item.toDostatus === 'Created' || item.toDostatus === 'Edited') {
          this.toDoList.push(item);
        }
    }
    //this.getAllDetails();
  } else if(toDoList.error === true && toDoList.status === 404) {
        this.router.navigate(['/']);
  }
})
}

createFriendList() {
 // console.log('friendList', this.friendList.data)
  
  for(let item of this.friendList.data) {
    if(item.requestedById === this.userId){
     
     this.getFriendList(item.requestedToId, 'requestTo', item);  
   } else if(item.requestedToId === this.userId) {
       this.getFriendList(item.requestedById, 'requestBy', item);
     }
   }
}


  addFriend(item) {
   
    this.friendDetails.requestedById = this.userId;
    this.friendDetails.requestedToId = item.userId;
    this.friendDetails.status = 'PENDING';
    this.friendDetails.requestedByName = this.firstName;
    this.friendDetails.requestedToName = item.firstName;
      
    //this.socketURL.emit("send-friendship",this.friendDetails)

    this.service.addFriendDetails(this.friendDetails).subscribe(data => {
     // console.log(data);
        let resData; 
            resData = data;
      if(resData.status === 200) {
        //this.getAllDetails();
      }
       
      
    })
  }

  getFriendList(userId, request, item) {
    
    // console.log('getFriendList', this.userDetails);

    let  userDetails = {
      'userId': userId,
      'authToken': this.userDetails.authToken
    }
    this.service.getUserById(userDetails).subscribe(data => {
     let res: any; 
     res = data;
     if(res.data !== null) {

       let resData = res.data[0];
         
         resData['itemId'] = item.id;
         resData['requestedById'] = item.requestedById;
         resData['requestedToId'] = item.requestedToId;
        if(request === 'requestTo' && item.status ==='PENDING') {
          this.friendRequest.push(resData);
        } else if(request === 'requestBy' && item.status === 'PENDING') {
          this.friendRequestSend.push(resData);
        } else if(item.status === 'ACCEPTED') {
          this.myFriends.push(resData);
        }
      }
    })
  }

  arrangeFriendsList() {
    //console.log(this.friendRequest)

    this.service.getAllDetails(this.userDetails).subscribe(data => {
      this.userList = data;
      if(this.userList) {
        for(let item of this.myFriends) {
          const idx = this.userList.findIndex((obj) => {
            return obj.userId === item.userId
          });
          if(idx != -1) {
            this.userList.splice(idx,1)
          }
        }


          for(let item of this.friendRequestSend) {
            const idx = this.userList.findIndex((obj) => {
              return obj.userId === item.userId
            });
            if(idx != -1) {
              this.userList.splice(idx,1)
            }
          }

        for(let item of this.friendRequest) {
          const idx = this.userList.findIndex((obj) => {
            return obj.userId === item.userId
          });
          if(idx != -1) {
            this.userList.splice(idx,1)
          }
        }
      }
      
    })
  }

  acceptFriendship(data) {
    let updateFriendDetails = {
      'requestedById': data.requestedById,
      'requestedToId':data.requestedToId,
      'status':'ACCEPTED',
      'id':data.itemId,
      'requestedByName':data.firstName,
      'requestedToName': this.firstName

    }
    this.service.updateFriendDetails(updateFriendDetails).subscribe(data => {

      let resData: any
      resData = data;
      if(resData.status === 200) {
        //this.getAllDetails();

      } else if(resData.status === 404) {
        this.toastr.info(resData.message);
      }
    }, error => {
      this.toastr.error(error);
    })
  }

  toDo() {
    this.toDoDetails.toDoName = '';
    $('#toDoModal').modal('show');
  }

  addToDo() {

    if(this.toDoDetails.toDoName === "") {
      this.toastr.info('Please Enter Todo List');
    } else {

    
   this.toDoDetails.status = 'Open';
   this.toDoDetails.userId = this.userId;
   this.toDoDetails.subToDoItems = [];
   this.toDoDetails.history = [];
   this.toDoDetails.toDostatus = 'Created';
   let historyDetails: string;
   historyDetails = `${this.toDoDetails.toDoName} Created by ${this.firstName}`;
   this.toDoDetails.history.push(historyDetails);
    historyDetails = '';
    this.service.addTodoList(this.toDoDetails).subscribe(data => {
     // console.log('toDoName', data);
      let response;
      response = data;

      if(response.error === true) {

      } else {
        $('#toDoModal').modal('hide');
        this.toDoDetails.toDoName = '';
        let userDetails = {
          'userId': this.userId,
          'authToken': this.authToken
        }

        //send-friendship-request

      this.getToDoListDetails(this.userDetails);
      }
    })
  }
  }

  showToDoList(item) {
    $('#toDoEditModal').modal('show');
    this.toDoDetails.toDoName = item.toDoName;
    this.toDoDetails.subToDoItems = item.subToDoItems;
    this.toDoDetails.toDoItemId = item.toDoItemId;
    this.toDoDetails.status = item.status;
    this.toDoDetails.userId = item.userId;
    this.toDoDetails.history = item.history;
  }

  addSubToDoItem() {
    let newSubToDoItem = {
      'subToDoName': this.subToDoItem
    }
    this.toDoDetails.subToDoItems.push(newSubToDoItem);
    this.subToDoItem = '';
  }

  updateToDo(item?: any, isedited?: boolean) {
   // console.log('TodoDetails', this.toDoDetails);
  let historyDetails: string;
  
  if(isedited) {
    this.toDoDetails.toDostatus = 'Edited';
    historyDetails = `${this.toDoDetails.toDoName} Edited by ${this.firstName}`;
    this.toDoDetails.history.push(historyDetails);
  } else {
    this.toDoDetails.toDostatus = 'Deleted';
    this.toDoDetails.toDoName = item.toDoName;
    this.toDoDetails.subToDoItems = item.subToDoItems;
    this.toDoDetails.toDoItemId = item.toDoItemId;
    this.toDoDetails.status = item.status;
    this.toDoDetails.userId = item.userId;
    this.toDoDetails.history = item.history;
    historyDetails = `${this.toDoDetails.toDoName} Deleted by ${this.firstName}`;    
    this.toDoDetails.history.push(historyDetails);
  }
    this.service.updateToDoList(this.toDoDetails).subscribe(data => {
     // console.log('update', data);
      let response;
       response = data;
      if(response.error === true) {

      } else {
    $('#toDoEditModal').modal('hide');
        let userDetails = {
          'userId': this.userId,
          'authToken': this.authToken
        }
      this.getToDoListDetails(userDetails);

      }
    })
  }

  deleteToDoList(item) {
    this.service.deleteToDoList(item.toDoItemId).subscribe(data => {
      //console.log(data);
      let response;
      response = data;
      if(response.error === true && response.message === 'No User Found') {
        let userDetails = {
          'userId': this.userId,
          'authToken': this.authToken
        }
      this.getToDoListDetails(userDetails);
      } else {
        let userDetails = {
          'userId': this.userId,
          'authToken': this.authToken
        }
      this.getToDoListDetails(userDetails);
      }
    })
  }

  myFriendDetails(item) {
    this.userClicked = true;
    this.selectedUser = item.userId;
    let userDetails = {
      'userId': item.userId,
      'authToken': this.authToken
    }

    this.getToDoListDetails(userDetails);

   // this.router.navigate(['friendtodolist', item.userId]);

  }

  showhistory(item) {
    //console.log('hiso', item);
    $('#historyModal').modal('show');
    if(item) {
      this.historyData = item;
    }

  }

  back() {
    this.userClicked = false;
  }
}
