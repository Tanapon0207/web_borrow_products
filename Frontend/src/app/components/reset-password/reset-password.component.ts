import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  email: string = '';
  emailData: any;


  constructor(
    private router: Router,
    private http: HttpClient
  ) { }


  ngOnInit(): void {

  }

  resetpassword() {


    let data_email = {
      "email": this.email,

    }


    this.http.post("http://localhost:9100/user/forgot-password", data_email).subscribe((res: any) => {
      console.log("38", res);






      // Swal.fire(
      //   'Send Email สำเร็จ!',
      //   'กรุณาเข้าเช็คข้อมูลที่ Email ของคุณ!',
      //   'success'

      // )

    })




  }









}






