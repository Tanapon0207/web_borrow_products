import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Return_Bill } from '../model/return-bill';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReturnBillService {

  returnBillURL : string;
  get_returnBillURL : string;

  constructor(private http: HttpClient) {

    this.get_returnBillURL = 'http://localhost:9100/return_bill'
    this.returnBillURL = 'http://localhost:9100/return_bill/add';
   }

   getAllReturn_Bill(): Observable<Return_Bill[]> {
    return this.http.get<Return_Bill[]>(this.get_returnBillURL);

  }


  ok_return_bill(return_bill: Return_Bill): Observable<Return_Bill> {

    return this.http.post<Return_Bill>(this.returnBillURL, return_bill);
  }

}
