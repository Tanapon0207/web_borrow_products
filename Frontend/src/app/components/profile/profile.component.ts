import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';
// import { BillService } from 'src/app/service/bill.service';


// import { Validators } from '@angular/forms';




import Swal from 'sweetalert2';
// import { data } from 'jquery';
// import { Return_Bill } from 'src/app/model/return-bill';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {



  [x: string]: any;
  name: any
  img: string = '';
  userId: string = '';
  email: string = '';
  user: any =
    {
      name: ' ',
      img: ' ',
      userId: ' ',
      email: '',
      phone: '',
      username: '',
      confirmpassword: '',
      role: '',
    }

  url: string = '';
  body: any;
  userDetail !: FormGroup;

  userObj: User = new User();
  length_user: number = 0
  userList: any[] = []; //
  userListtemp: any[] = [];
  count_bill: any;
  count_return_bill: any;


  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    // private billservice: BillService
  ) { }



  ngOnInit(): void {
    this.get_amount_bill();
    this.get_amount_return_bill();


    this.user = JSON.parse(localStorage.getItem('user') ?? '');
    // console.log("is userid", this.user);

    this.http.get(`http://localhost:9100/user/${this.user.userId}`).subscribe((datauser: any) => {
      console.log("ข้อมูลผู้ใช้งาน", datauser.object.username);

      this.user.img = datauser.object.picture
      this.user.email = datauser.object.email
      this.user.phone = datauser.object.phone
      this.user.username = datauser.object.username
      this.user.confirmpassword = datauser.object.confirmpassword
      this.user.role = datauser.object.role
      // this.user.name = datauser.object.name
      console.log("ภาพ User", this.user.img);

    })


  }



  onSelect(event: any) {
    this.url = `http://localhost:9100/showimg/${this.user.img}`; // รูปภาพตั้งต้นก่อนที่จะเลือกแต่ภาพไม่ขึ้น
    let fileType = event.target.files[0].type; // กำหนด type ของภาพ
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      const fileselect = event.target.files[0];
      const filename = event.target.files[0].name; // เข้าถึงชื่อไฟล์

      console.log(filename, " <<< นี่คือชื่อรูปภาพที่คุณเลือก");
      // กำหนดค่าใน body
      this.body = {
        name: filename,

      };


      reader.readAsDataURL(fileselect as Blob);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        let base64file = this.url.split(';base64,').pop();


        console.log(base64file, " <<< ค่าไฟล์รูปภาพ Base64");
        // this.userObj.picture = this.url;

        this.body.base64 = base64file


      };
    } else {
      window.alert('คุณยังไม่ได้เลือกรูปภาพของคุณ!!!');
    }




  }



  saveimg() {
    let body = {
      name: this.body.name, // ใช้ this.body.name ชื่อไฟล์
      base64: this.body.base64 // ใช้ this.body.base64 ชื่อไฟล์ base64
    };

    console.log(body, "ค่าที่มีอยู่ใน body");
    this.userObj.picture = this.body;
  }






  getAllUser() {

    this.userDetail = this.formBuilder.group({
      _id: [''],
      picture: [''],
      name: [''],
      email: [''],
      phone: [''],
      username: [''],
      password: [''],
      confirmpassword: [''],

      time_add_user: this.formBuilder.group({
        time_add: [''],
        time_update: [''],
        time_delete: ['']
      })



    });

    this.userService.getAllUser().subscribe(res => {

      this.length_user = res.length;

      this.userList = res;
      this.userListtemp = res;
      console.log(this.userListtemp);
      console.log(this.length_user);


    }, err => {
      console.log("ข้อผิดพลาดในการเรียกใช้เเสดงข้อมูล")

    });

  }


  clear() {
    this.userDetail.reset();
    // this.resetImage()
  }


  submit_edit_profile() {
    // this.goToNextStep();
    Swal.fire(
      'แก้ไขข้อมูลสำเร็จ!',
      'อัพเดตข้อมูลของคุณเรียบร้อยแล้ว!',
      'success'
    )
  }





  get_amount_bill() {
    let countbill = 0; // ตัวแปรเพื่อเก็บจำนวน

    this.http.get<any[]>('http://localhost:9100/bill').subscribe(
      (details: any[]) => {


        details.forEach(element => {

          if (element.nameuser === this.user.name) {
            countbill++;
            // console.log(element);
          }
        });


        console.log("จำนวนที่คุณยืม:", countbill);
        this.count_bill = countbill
      },
      error => {
        console.error("Error fetching data:", error);
      }
    );
  }


  get_amount_return_bill() {
    let count_returnbill = 0;
    this.http.get<any[]>('http://localhost:9100/return_bill').subscribe(
      (return_details: any[]) => {

        return_details.forEach(element => {

          if (element.nameuser === this.user.name) {
            count_returnbill++;

          }
        });


        console.log("จำนวนที่คุณคืน:", count_returnbill);
        this.count_return_bill = count_returnbill
      },
      error => {
        console.error("Error fetching data:", error);
      }
    );
  }


  //แก้ไข user
  editUser(user: User) {

    this.userDetail.controls['_id'].setValue(user._id);
    this.userDetail.controls['picture'].setValue(user.picture);
    this.userDetail.controls['name'].setValue(user.name);
    this.userDetail.controls['email'].setValue(user.email);
    this.userDetail.controls['phone'].setValue(user.phone);
    this.userDetail.controls['username'].setValue(user.username);
    this.userDetail.controls['password'].setValue(user.password);
    this.userDetail.controls['confirmpassword'].setValue(user.confirmpassword);


  }




  // //อัปเดท user
  updateUser() {

    this.userObj._id = this.user.userId;
    this.userObj.picture = this.body;
    this.userObj.name = this.user.name;
    this.userObj.email = this.user.email;
    this.userObj.phone = this.user.phone;
    this.userObj.username = this.user.username;
    this.userObj.password = this.user.confirmpassword; // password กับ confirmpassword เหมือนกัน
    this.userObj.confirmpassword = this.user.confirmpassword;



    console.log("410", this.userObj);

    this.userService.updateUser(this.userObj).subscribe(
      res => {


        Swal.fire(
          'แก้ไขข้อมูลสำเร็จ!',
          'ข้อมูลของคุณเป็นปัจจุบันเรียบร้อยแล้ว!',
          'success'
        );
        //console.log(res);
        this.getAllUser();
        location.reload();





      },
      err => {
        console.log(err);
      }
    );
  }



  // updateUser() {
  //   // นำข้อมูลจากตัวแปร user ไปใช้ในการอัปเดต
  //   console.log("316", this.user);

  //   this.userService.updateUser(this.user).subscribe(
  //     res => {
  //       Swal.fire(
  //         'แก้ไขข้อมูลสำเร็จ!',
  //         'ข้อมูลของคุณเป็นปัจจุบันเรียบร้อยแล้ว!',
  //         'success'
  //       );
  //       this.getAllUser();
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }
























}
