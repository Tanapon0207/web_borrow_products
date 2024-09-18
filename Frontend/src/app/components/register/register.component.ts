import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  bodyData: any;
  name: string = "";
  email: string = "";
  phone : string = "";
  username: string = "";
  password: string = "";
  confirmpassword: string = "";
  role:string ="";


  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit(): void {
  }




  register() {
    let bodyData =
    {

      // "img_user": this.img_user,
      "name": this.name,
      "email": this.email,
      "phone": this.phone,
      "username": this.username,
      "password": this.password,
      "confirmpassword": this.confirmpassword,
      "role": this.role


    };



    if (bodyData != null) {
      Swal.fire(
        'ไม่สำเร็จ!',
        'กรุณากรอกข้อมูลให้ครบถ้วน',
        'error'
      )
    }


    if (this.password != this.confirmpassword) {
      Swal.fire(
        'ไม่สำเร็จ!',
        'กรุณากรอก password กับ confirmpassword ให้ตรงกัน',
        'warning'
      )

    }




    else if (bodyData) {

      this.http.post("http://localhost:9100/user/register", bodyData).subscribe((resultData: any) => {

        console.log(resultData);
        Swal.fire(
          'Register สำเร็จ!',
          'ลงทะเบียนเรียบร้อยเเล้ว!',
          'success'

        )



        this.router.navigateByUrl('/login', {
          state: {

            // img_user: bodyData.img_user,
            name: bodyData.name,
            email: bodyData.email,
            phone: bodyData.phone,
            username: bodyData.username,
            password: bodyData.password,
            confirmpassword: bodyData.confirmpassword
          }
        });
        console.log(bodyData);
        console.log("This is Firstname :" + bodyData.name);
        console.log("This is Gmail :" + bodyData.email);
        console.log("This is phone :" + bodyData.phone);
        console.log("This is Password :" + bodyData.password);
        console.log("This is Confirmpassword :" + bodyData.confirmpassword);

      });


    }


  }

    save() {
      this.register();
    }


}
