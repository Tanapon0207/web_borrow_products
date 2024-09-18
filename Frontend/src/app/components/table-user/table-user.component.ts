import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/user';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../service/file-upload.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent implements OnInit {


  url: string = '';

  @ViewChild('fileInput')
  fileInput!: ElementRef;
  userDetail !: FormGroup;
  userObj: User = new User();
  length_user: number = 0
  userList: any[] = []; //
  userListtemp: any[] = [];
  day_y: string = '';
  time_n: string = '';
  rowNumber = 1
  selectedUser: any
  user: any
  message: string[] = [];
  progressInfos: any[] = [];
  selectedFiles?: FileList;
  previews: string[] = [];
  files: File | null = null;
  filePath = ""
  selectedFile: File | null = null;
  body: any;
  bodyData: any;
  // img_user: any;
  filename: any;
  public: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";
  username: string = "";
  password: string = "";
  confirmpassword: string = "";
  role: string = "";
  maxLength: number = 0
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();


  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private uploadService: FileUploadService,
    private http: HttpClient,
    private router: Router,


  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'simple_numbers',
      processing: true

    };
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    $.extend(true, $.fn.dataTable.defaults, {
      "language": {
        "sProcessing": "กำลังดำเนินการ...",
        "sLengthMenu": "แสดง_MENU_ แถว",
        "sZeroRecords": "ไม่พบข้อมูล",
        "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
        "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
        "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
        "sInfoPostFix": "",
        "sSearch": "ค้นหา:",
        "sUrl": "",
        "oPaginate": {
          "sFirst": "เริ่มต้น",
          "sPrevious": "ก่อนหน้า",
          "sNext": "ถัดไป",
          "sLast": "สุดท้าย"
        }
      },
    });





    this.getAllUser();

    // this.userList
    this.userDetail = this.formBuilder.group({
      _id: [''],
      picture: [''],
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      username: [''],
      password: [''],
      confirmpassword: [''],
      role: ['role_user', Validators.required],
      time_add_user: this.formBuilder.group({
        time_add: [''],
        time_update: [''],
        time_delete: ['']
      })



    });



    // กำหนดค่าให้กับตัวแปร date_y
    const date_buy = new Date();
    const day = date_buy.getDate();
    const month = date_buy.getMonth() + 1;
    const year = date_buy.getFullYear();
    const hours = date_buy.getHours();
    const minutes = date_buy.getMinutes();

    this.day_y = `${day}/${month}/${year}`; // แยกวันเดือนปีและเวลา
    this.time_n = `${hours}:${minutes}`;
    console.log(this.day_y);
    console.log(this.time_n);


  }



  onSelect(event: any) {
    this.url = '---'; // รูปภาพตั้งต้นก่อนที่จะเลือกแต่ภาพไม่ขึ้น
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



  resetImage() {
    this.url = '';
    this.fileInput.nativeElement.value = ''; // รีเซ็ตค่า "เลือกไฟล์" เป็นค่าว่าง
  }


  clear() {
    this.userDetail.reset();
    this.resetImage()
  }



  onSelect_edit(event: any) {
    this.url = `http://localhost:9100/showimg/${this.body}`; // รูปภาพตั้งต้นก่อนที่จะเลือกแต่ภาพมไม่ขึ้น
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


  saveimg_edit() {
    let body = {
      name: this.body.name, // ใช้ this.body.name ชื่อไฟล์
      base64: this.body.base64 // ใช้ this.body.base64 ชื่อไฟล์ base64
    };

    console.log(body, "ค่าที่มีอยู่ใน body");
    this.userObj.picture = this.body;
  }



  resetImage_edit() {
    this.url = '';
    this.fileInput.nativeElement.value = ''; // รีเซ็ตค่า "เลือกไฟล์" เป็นค่าว่าง
  }


  clear_edit() {
    this.userDetail.reset();
    this.resetImage()
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
      role: ['role_user', Validators.required],

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

      this.dtTrigger.next(null);
    }, err => {
      console.log("ข้อผิดพลาดในการเรียกใช้เเสดงข้อมูล")

    });

  }





  addUser() {


    if (this.userDetail.valid) {
      this.saveimg()
      // this.userObj.picture = this.userDetail.value.picture;

      this.userObj.name = this.userDetail.value.name;
      this.userObj.email = this.userDetail.value.email;
      this.userObj.phone = this.userDetail.value.phone;
      this.userObj.username = this.userDetail.value.username;
      this.userObj.password = this.userDetail.value.password;
      this.userObj.confirmpassword = this.userDetail.value.confirmpassword;
      this.userObj.role = this.userDetail.value.role;

      console.log('userObj', this.userObj);
      this.userService.addUser(this.userObj).subscribe(
        res => {

          Swal.fire(
            'เพิ่มข้อมูลสำเร็จ!',
            'เพิ่มข้อมูลในฐานข้อมูลเรียบร้อยแล้ว!',
            'success'
          )

          //console.log(this.productObj);
          this.getAllUser();
          this.userDetail.reset();
          this.clear();
        },
        err => {
          console.log(err);
        }
      );
    } else {
      Swal.fire(
        'เกิดข้อผิดพลาด!',
        'กรุณากรอกข้อมูลให้ครบถ้วน',
        'error'
      );
    }


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
    this.userDetail.controls['role'].setValue(user.role);

  }




  //อัปเดท user
  updateUser() {

    this.userObj._id = this.userDetail.value._id;
    this.userObj.picture = this.body;
    this.userObj.name = this.userDetail.value.name;
    this.userObj.email = this.userDetail.value.email;
    this.userObj.phone = this.userDetail.value.phone;
    this.userObj.username = this.userDetail.value.username;
    this.userObj.password = this.userDetail.value.password;
    this.userObj.confirmpassword = this.userDetail.value.confirmpassword;
    this.userObj.role = this.userDetail.value.role;



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



  clickdelete(user: User) {

    Swal.fire({
      title: 'คุณยืนยันที่จะลบข้อมูลหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(user);
        console.log(user);

      }
    })

  }



  //ลบ user
  deleteUser(user: User) {
    this.userObj._id = user._id;
    console.log(this.userObj._id);

    let datadelete = {
      _id: user._id,
    };

    this.userService.deleteUser(datadelete).subscribe(
      (res: any) => {

        Swal.fire('ลบข้อมูลสำเร็จ!', 'ข้อมูลของคุณลบเรียบร้อยแล้ว!', 'success');

        //console.log(res);
        this.getAllUser();

        // กำหนดค่าให้กับตัวแปร date_y
        const date_buy = new Date();
        const day = date_buy.getDate();
        const month = date_buy.getMonth() + 1;
        const year = date_buy.getFullYear();
        const hours = date_buy.getHours();
        const minutes = date_buy.getMinutes();

        this.day_y = `${day}/${month}/${year}`; // แยกวันเดือนปีและเวลา
        this.time_n = `${hours}:${minutes}`;
        console.log(this.day_y);
        console.log(this.time_n);




      },
      (err: any) => {
        console.log(err);
      }
    );
  }






















}
