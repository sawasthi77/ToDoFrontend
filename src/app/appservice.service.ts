import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {
  httpHeaders = new HttpHeaders();
  httpOptions: any;
  authToken: string;

  constructor(private http: HttpClient) {
    this.authToken = localStorage.getItem('authToken');

  }

  //url = 'https://shielded-bayou-65133.herokuapp.com/api/v1';
  url = 'https://fast-island-94955.herokuapp.com/api/v1';

  login(user) {
    let response = this.http.post(`${this.url}/login`, user);
    return response;
  } // end of login

  getAllDetails(userDetails) {
    this.authToken = userDetails.authToken;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': userDetails.authToken
      })
    }
    let response = this.http.get(`${this.url}/${userDetails.userId}/all`, this.httpOptions);
    return response;
  }

  addFriendDetails(friendDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authToken
      })
    }
    let response = this.http.post(`${this.url}/friendsDetails`, friendDetails, this.httpOptions);
    return response;
  }
  getUserById(userDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': userDetails.authToken
      })
    }
    let response = this.http.get(`${this.url}/${userDetails.userId}/details`, this.httpOptions);
    return response;
  }

  getFriendDetails(userDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': userDetails.authToken
      })
    }
    let response = this.http.get(`${this.url}/${userDetails.userId}/friendsDetails`, this.httpOptions);
    return response;
  }

  updateFriendDetails(friendDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authToken
      })
    }
    let response = this.http.post(`${this.url}/updatefriendsDetails`, friendDetails, this.httpOptions);
    return response;
  }

  addTodoList(toDoDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authToken
      })
    }
    let response = this.http.post(`${this.url}/addtodolist`, toDoDetails, this.httpOptions);
    return response;
  }

  getToDoList(userDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': userDetails.authToken
      })
    }
    let response = this.http.get(`${this.url}/${userDetails.userId}/gettodolist`, this.httpOptions);
    return response;
  }

  updateToDoList(toDoDetails) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authToken
      })
    }
    let response = this.http.put(`${this.url}/updatetodolist`, toDoDetails, this.httpOptions);
    return response;
  }

  deleteToDoList(toDoItemId) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authToken
      })
    }
    let response = this.http.delete(`${this.url}/${toDoItemId}/deleteToDoList`, this.httpOptions);
    return response;
  }

  logout(userDetails) {
   let userObj = {
     userId: userDetails.userId
   }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': userDetails.authToken
      })
    }
    let response = this.http.post(`${this.url}/logout`,userObj, this.httpOptions);
    return response;
  } // end of logout

  forgotPassword(email) {
    let response = this.http.post(`${this.url}/forgot-password`, email);
    return response;
  } // end of forgot password

  signup(userDetails) {
    let response = this.http.post(`${this.url}/signup`, userDetails);
    return response;
  }

}

