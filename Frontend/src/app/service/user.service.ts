import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList() {
    throw new Error('Method not implemented.');
  }
  /*
    filter(arg0: (u: any) => boolean): UserService {
      throw new Error('Method not implemented.');
    }
    */


  addUserURL: string;
  getUserURL: string;
  getIdURL: string;
  updateUserURL: string;
  deleteUserURL: string;
  backUserURL: string;
  loginUserURL: string;

  constructor(private http: HttpClient) {
    this.addUserURL = 'http://localhost:9100/user/create';
    this.getUserURL = 'http://localhost:9100/user';
    this.getIdURL = 'http://localhost:9100//user/:id';
    this.updateUserURL = 'http://localhost:9100/user/update';
    this.deleteUserURL = 'http://localhost:9100/user/delete';
    this.backUserURL = 'http://localhost:9100/user/back';
    this.loginUserURL = 'http://localhost:9100/user/login';

  }

  addUser(user: User): Observable<User> {

    return this.http.post<User>(this.addUserURL, user);
  }


  loginUser(user: User): Observable<User>{
    return this.http.post<User>(this.loginUserURL, user);
  }


  getAllUser(): Observable<User[]> {

    return this.http.get<User[]>(this.getUserURL);

  }


  getIdUser(): Observable<User[]> {

    return this.http.get<User[]>(this.getIdURL);

  }




  updateUser(user: User): Observable<User> {
    return this.http.post<User>(this.updateUserURL, user);
  }

  /*
    deleteCar(car: Car): Observable<Car> {
      return this.http.delete<Car>(this.deleteCarURL + '/' + car._id);
    }
  */

  deleteUser(user: any): Observable<User> {
    console.log(user)
    return this.http.post<User>(this.deleteUserURL, user);

  }


  backUser(user: any): Observable<User> {
    console.log(user)
    return this.http.post<User>(this.backUserURL, user);

  }



}
