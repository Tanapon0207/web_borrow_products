import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bill } from '../model/bill';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class BillService {

  addBillURL: string;
  getBillURL: string;
  updateBillURL: string;
  deleteBillURL: string;
  backBillURL: string;
  getBillDashboardURL: string;  //เเสดงข้อมูลใน แดชบอท

  amount_billURL : string;
  amount_returnURL : string;

  constructor(private http: HttpClient) {
    this.addBillURL = 'http://localhost:9100/bill/create';
    this.getBillURL = 'http://localhost:9100/bill';
    this.updateBillURL = 'http://localhost:9100/bill/update';
    this.deleteBillURL = 'http://localhost:9100/bill/delete';
    this.backBillURL = 'http://localhost:9100/bill/back';
    this.getBillDashboardURL = 'http://localhost:9100/bill/dashboard';

    this.amount_billURL = 'http://localhost:9100/bill/amount_bill';
    this.amount_returnURL = 'http://localhost:9100/bill/amount_return';
  }

  addBill(bill: Bill): Observable<Bill> {

    return this.http.post<Bill>(this.addBillURL, bill);
  }



  get_amount_bill(): Observable<Bill[]> {

    return this.http.get<Bill[]>(this.amount_billURL);

  }

  get_amount_return(): Observable<Bill[]> {

    return this.http.get<Bill[]>(this.amount_returnURL);

  }


  getBillDashboard(): Observable<Bill[]> {

    return this.http.get<Bill[]>(this.getBillDashboardURL);

  }


  getAllBill(): Observable<Bill[]> {

    return this.http.get<Bill[]>(this.getBillURL);

  }


  updateBill(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.updateBillURL, bill);
  }

  // ok_return_bill(bill: return_Bill): Observable<return_Bill> {
  //   return this.http.put<return_Bill>(this.returnBillURL, bill);
  // }





  deleteBill(bill: any): Observable<Bill> {
    console.log(bill)
    return this.http.post<Bill>(this.deleteBillURL, bill);

  }

  backBill(bill: any): Observable<Bill> {
    console.log(bill)
    return this.http.post<Bill>(this.backBillURL, bill);

  }

}
