import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})



export class LoginService {

username: string = "";
password: string = "";

  private apiUrl = 'http://localhost:9100/api/login';


  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password })

  }


  logout(): void {
    // ทำการล้างค่า username และ password
    localStorage.clear()

    // localStorage.removeItem()
  }
   tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

}
