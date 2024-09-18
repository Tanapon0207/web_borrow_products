import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import Swal from 'sweetalert2';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  username: string = "";
  password: string = "";
  login_count: number = 0;
  data: any;
  isLogin: boolean = true;
  errorMessage: string = "";
  token: any;
  datatoken: any

  constructor(
    private router: Router,
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {


  }


  getTokenExpirationDate(token: string): any {
    let decoded: any = jwt_decode(token);

    if (decoded.exp === undefined) { return null };

    const date = new Date(0);
    console.log(date);

    date.setUTCSeconds(decoded.exp);

    console.log(date);


    return date;
  }


  isTokenExpired(token?: string): boolean {
    if (!token) this.token = localStorage.getItem('token');

    if (!token) return true;

    const date = this.getTokenExpirationDate(token);

    if (date === undefined || date == null) return true;
    console.log(date);

    return (date.valueOf() < new Date().valueOf());


  }




  login() {
    // เตรียมข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
    let bodyData = {

      username: this.username,
      password: this.password,
    };





    // ทำการส่งคำขอ POST ไปยังเซิร์ฟเวอร์
    this.http.post("http://localhost:9100/user/login", bodyData).subscribe((resultData: any) => {


      // ตรวจสอบผลลัพธ์ที่ได้จากเซิร์ฟเวอร์
      if (resultData.status) {
        Swal.fire(
          'Login สำเร็จ!',
          'เข้าสู่ระบบเรียบร้อยแล้ว!',
          'success'
        );


        // console.log(resultData);


        this.login_count++;

        // Update the login count for the user
        //this.updateLoginCount(this.username, this.login_count);

        console.log(this.login_count);


        //แสดงวันที่และเวลา
        let date_buy = new Date();
        //console.log(date_buy.toString());
        console.log(date_buy.toLocaleString());
        let result = date_buy.toLocaleString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });

        // console.log(bodyData);
        // console.log(result);
        localStorage.setItem('token', resultData.token); //เก็บข้อมูลไว่ใน  localStorage
        localStorage.setItem('user', JSON.stringify(resultData.user)); //เก็บข้อมูลไว่ใน  localStorage
        console.count(resultData.message._id); //ค่า id กับจำนวนที่ login
        // นำทางไปยังหน้า dashboard หลังจากเข้าสู่ระบบสำเร็จ
        window.location.href = '/dashboard';


      }

      else {
        Swal.fire(
          'Login ไม่สำเร็จ!',
          'กรุณากรอกข้อมูลผู้ใช้ใหม่!',
          'error'
        );
        console.log("Error login");


      }



    });


  }


  logout() {
    // เรียกใช้ฟังก์ชัน logout ของ LoginService
    this.loginService.logout();
  }



}
function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}
