
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



import Swal from 'sweetalert2';
import { data } from 'jquery';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  isAuth = localStorage.getItem('token');
  userRole: string ='';
  name: string = ' ';
  img: string = '';
  userId: string = '';
  user: any =
    {
      name: "",
      img: '',
      userId: ' ',

    }





  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // this.name = this.userdata.name;
  }


  ngOnInit(): void {
    this.isAuth = localStorage.getItem('token');

    this.user = JSON.parse(localStorage.getItem('user') ?? '');
    // console.log(this.user.name, "ชื่อผู้ใช้ที่มีอยู่ใน Tokens");
    // console.log(this.user.userId);


    this.http.get(`http://localhost:9100/user/${this.user.userId}`).subscribe((resultData: any) => {
      // console.log(resultData, "******");
      // console.log(resultData.user.picture);
      // console.log(resultData, "*********");
      // console.log("56 userdata: ", resultData);
      // console.log("57 roledata: ", resultData.object.role);
        // อัปเดตค่า userRole
        this.userRole = resultData.object.role;

      // if(resultData.object.role == "User"){

      // }

      this.user.img = resultData.object.picture;
      console.log(this.user.img, '<<< ชื่อรูปภาพของคนคนนี้');


    });



  }


  logout(): void {

    if (!this.user) { //ถ้าไม่ได้ login ไม่สามารถกด logout ได้

      Swal.fire({
        title: 'คุณยังไม่ได้ Login กรุณา Login!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง'
      }).then((result) => {

        if (result.isConfirmed) {
          this.router.navigateByUrl('/login');

        } else {
          // this.router.navigateByUrl('/login');

        }
      })




      return;
    }

    Swal.fire({
      title: 'คุณยืนยันที่จะออกจากระบบหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน'
    }).then((result) => {

      if (result.isConfirmed) {
        Swal.fire(
          'ออกจากระบบสำเร็จ!',
          ' ',
          'success'
        )

        // Remove the token and update the logged-in state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
        window.location.href = ""
        this.router.navigateByUrl('/login');

      }
    })
  }


  status: boolean = true;
  clickEvent() {
    this.status = !this.status;
  }




}
