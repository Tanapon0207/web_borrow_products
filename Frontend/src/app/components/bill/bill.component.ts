import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Bill } from '../../model/bill';
import { Return_Bill } from 'src/app/model/return-bill';
import { ReturnBillService } from 'src/app/service/return-bill.service';
import { BillService } from '../../service/bill.service';
import { ProductService } from '../../service/product.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';




//import Swal from 'sweetalert2';
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
})
export class BillComponent implements OnInit {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  date_now: string = '';
  day_b: string = '';
  row: any;
  date_buy: string = '';
  borrow_datetime: string = '';
  borrow_time: String = '';
  currentTimestamp: number = 0;
  currentTime: string = '';
  currentTime1: string = '';
  productList: any;
  rowNumber = 1;
  bills: [] = [];
  billDetail!: FormGroup;
  returnbill1!: FormGroup;
  billList: any;
  billListtemp: any[] = [];
  billObj: Bill = new Bill();
  return_billObj: Return_Bill = new Return_Bill();
  productNos: any[] = [];
  productNos1: any[] = [];
  productDetails: any = {};
  barcode: string = '';
  values: string[] = [];
  cities: any[] = [];
  selectedCity: any;
  name: string = ' ';
  nameuser: string = '';
  username: string = '';
  product_bill: string = '';
  length_p: number = 0;
  product: any;
  isButtonHidden: boolean = false;
  isButtonHidden1: boolean = true;
  data: any = localStorage.getItem('token');
  datauser: any = JSON.parse(localStorage.getItem('user') ?? '');
  userdata = this.data;


  //card hearder
  bill_amount_sum = 0;
  bill_amount = 0;
  return_amount = 0;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private billService: BillService,
    private returnService: ReturnBillService,
    private router: Router
  ) { }


  ngOnInit(): void {
    // console.log(this.data);
    // console.log(this.datauser.name);
    // console.log(this.datauser);

    this.getAllBill();
    this.get_amount_bill();

    // กำหนดค่าให้กับตัวแปร date_y
    const date_buy = new Date();
    const day = date_buy.getDate();
    const month = date_buy.getMonth() + 1;
    const year = date_buy.getFullYear();
    const hours = date_buy.getHours();
    const minutes = date_buy.getMinutes();

    this.borrow_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;

    console.log(this.borrow_datetime, "วัน/เดือน/ปี เวลา");

    this.dtOptions = {
      pagingType: 'simple_numbers',
      processing: true
    };

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



    this.billDetail = this.formBuilder.group({
      _id: [''],
      bill_no: [''],
      nameuser: [''],
      borrow_datetime: [''],
      project: [''],
      product_bill: [''],

    });



    this.billDetail.patchValue({
      nameuser: `${this.datauser.name}`,

    });


    this.returnbill1 = this.formBuilder.group({
      _id: [''],
      bill_no: [''],
      nameuser: [''],
      borrow_datetime: [''],
      project: [''],
      details: [''],
      product_bill: [''],

    });


    this.returnbill1.patchValue({
      nameuser: `${this.datauser.name}`,

    });

  }

  clear() {
    this.billDetail.reset({
      barcode: '',
      project: '',
    });


  }


  get_amount_bill() {
    this.billService.getAllBill().subscribe((sum_amount_bill: any) => {
      this.bill_amount_sum = sum_amount_bill.length;

    });


    this.billService.get_amount_bill().subscribe((amount_bill: any) => {
      this.bill_amount = amount_bill.length;
    });

    this.billService.get_amount_return().subscribe((amount_return: any) => {
      this.return_amount = amount_return.length;
    });


  }




  onKey(event: any) {
    this.barcode = event.target.value;
    console.log('Barcode:', this.barcode);

  }


  okbarcode(event: any) {
    const barcodeValue = event.target.value;

    this.http.get(`http://localhost:9100/product/barcode/${barcodeValue}`).subscribe((data: any) => {
      console.log("198", data);
      console.log("206",data.barcode_id.Isuse);


      if(data.barcode_id.Isuse == 0){
        Swal.fire(
          'ไม่มีสินค้านี้อยู่ในระบบ!',
          'กรุณาตรวจสอบรหัสสินค้า',
          'warning'
        );

      }else{
        const parsedData = data as any;
        console.log("209", parsedData);


        const existingBillIndex = this.billObj.product_bill.findIndex(item => item.product_no === parsedData.barcode_id.product_no);

        console.log("214", existingBillIndex);

        if (existingBillIndex !== -1) {
          // หาก index น้อยกว่า 1 เเล้วให้ +1 ไป
          let amount_before_scan = this.billObj.product_bill[existingBillIndex].amount;
          console.log("217", amount_before_scan);

          if ((amount_before_scan) <= parsedData.barcode_id.amount) {
            this.billObj.product_bill[existingBillIndex].amount++;
          } else {
            Swal.fire(
              'ไม่สามารถเพิ่มจำนวนการยืมได้!',
              'สินค้าในคลังไม่เพียงพอ!',
              'warning'
            );
          }
        } else {
          // ถ้าสแกนซ้ำ amount + 1 ไปเรื่อย ๆ
          this.billObj.product_bill.push({ ...parsedData.barcode_id, amount: 1 });
        }

      }

      event.target.value = '';
    });
  }


  // ปุ่ม + , - เเละการลบของ add_product_bill
  reduceAmount(index: number) {
    if (this.billObj.product_bill[index].amount > 1) {
      this.billObj.product_bill[index].amount--;
    } else {
      Swal.fire(
        'ไม่สามารถลดจำนวนการยืมได้!',
        'สินค้าในคลังไม่เพียงพอ!',
        'warning'
      );
    }

  }



  // add_product_inbill:any

  addAmount(index: number) {


    let amount_before_add = this.billObj.product_bill[index].amount;
    let pro_no = this.billObj.product_bill[index].product_no;

    this.http.get(`http://localhost:9100/product/barcode/${pro_no}`).subscribe((data_product_no: any) => {
      // console.log("255", data_product_no.barcode_id.amount);
      // console.log("253", pro_no);
      // console.log("252", amount_before_add);

      if ((amount_before_add) < data_product_no.barcode_id.amount) {
        this.billObj.product_bill[index].amount++
      } else {
        Swal.fire(
          'ไม่สามารถเพิ่มข้อมูลการยืมได้!',
          'สินค้าในคลังไม่เพียงพอ!',
          'warning'
        );
      }

    })


  }



  delete_productbill(index: number) {
    Swal.fire({
      title: 'คุณยืนยันที่จะลบสินค้านี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
    }).then((result) => {
      if (result.isConfirmed) {
        this.billObj.product_bill.splice(index, 1);
      }
    });
  }



  add_edit_barcode(event: any) {
    const barcodeValue = event.target.value;

    this.http.get(`http://localhost:9100/product/barcode/${barcodeValue}`).subscribe((data: any) => {

      console.log(data);

      const parsedData = data as any;
      const existingBillIndex = this.product_billEdit.findIndex((item: { product_no: any; }) => item.product_no === parsedData.barcode_id.product_no);
      console.log(existingBillIndex);


      if (existingBillIndex !== -1) {
        // หาก index น้อยกว่า 1 เเล้วให้ +1 ไป
        this.product_billEdit[existingBillIndex].amount++;
      } else {
        // ถ้าสแกนซ้ำ amount + 1 ไปเรื่อยๆ
        this.product_billEdit.push({ ...parsedData.barcode_id, amount: 1 });
      }

      const return_product_amount = this.product_billEdit[existingBillIndex].amount
      // console.log("316", return_product_amount);
      event.target.value = '';
    });
  }






  // ปุ่ม + , - เเละการลบของ edit_product_bill
  ed_reduceAmount(index: number) {
    if (this.product_billEdit[index].amount > 1) {
      this.product_billEdit[index].amount--;
    } else {
      Swal.fire(
        'ไม่สามารถลดจำนวนการยืมได้!',
        'สินค้าไม่เพียงพอ!',
        'warning'
      );
    }
  }

  ed_addAmount(index: number) {
    console.log("341", this.product_billEdit[index].product_no);
    let edit_amount_product_no = this.product_billEdit[index].product_no
    this.http.get(`http://localhost:9100/product/barcode/${edit_amount_product_no}`).subscribe((data_amount_edit: any) => {
      // console.log("345", data_amount_edit);
      // console.log("345", data_amount_edit.barcode_id.amount);

      // console.log("344", this.product_billEdit[i].amount);
      if (this.product_billEdit[index].amount < data_amount_edit.barcode_id.amount) {
        this.product_billEdit[index].amount++
      } else {
        Swal.fire(
          'ไม่สามารถเพิ่มจำนวนการยืมได้!',
          'สินค้าในคลังไม่เพียงพอ!',
          'warning'
        );
      }


    })


  }






  // ปุ่ม + , - เเละการลบของ edit_product_bill
  return_reduceAmount(index: number) {
    if (this.product_billEdit[index].amount_return > 1) {
      this.product_billEdit[index].amount_return--;
    } else {
      Swal.fire(
        'ไม่สามารถลดจำนวนการคืนได้!',
        'สินค้าในคลังไม่เพียงพอ!',
        'warning'
      );
    }
  }



  return_addAmount(index: number) {
    let add_amount_return = this.product_billEdit[index].amount_return
    if (add_amount_return < this.product_billEdit[index].amount) {
      this.product_billEdit[index].amount_return++;
    } else {
      Swal.fire(
        'ไม่สามารถเพิ่มจำนวนการคืนได้!',
        'สินค้าในคลังไม่เพียงพอ!',
        'warning'
      );
    }

  }


  ed_delete_productbill(index: number) {
    Swal.fire({
      title: 'คุณยืนยันที่จะลบสินค้านี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
    }).then((result) => {
      if (result.isConfirmed) {
        this.product_billEdit.splice(index, 1);
      }
    });
  }




  showbill() {

    //กำหนดค่าเวลา
    this.currentTimestamp = Date.now();
    console.log('Current Timestamp:', this.currentTimestamp);
    const currentDate = new Date(this.currentTimestamp);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    //ฟอเม็ต เวลา โดยการใส่ 0 เข้าไปด้านหน้าหากมีค่าเป็นตัวเลขที่น้อยกว่า 0
    const hoursFormatted = hours < 10 ? `0${hours}` : hours;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;


    //ฟอเม็ต วัน / เดือน  โดยการใส่ 0 เข้าไปด้านหน้าหากมีค่าเป็นตัวเลขที่น้อยกว่า 0
    const dayFormatted = day < 10 ? `0${day}` : day;
    const monthFormatted = month < 10 ? `0${month}` : month;
    this.borrow_time = `${year}-${monthFormatted}-${dayFormatted} ${hoursFormatted}:${minutesFormatted}`;
    this.billDetail.patchValue({
      // nameuser: `${this.datauser.name}`,
      borrow_datetime: `${this.borrow_time}`,

    });

    console.log(this.billDetail.value.nameuser);
    console.log(this.currentTime1);
    console.log(this.currentTime);

    // เป็นการ random ค่า bill
    function myRandom(min: number, max: number) {
      const N = max - min + 1;
      return Math.floor(Math.random() * N) + min;
    }

    // console.log("Random number between 100 - 200");
    for (let i = 0; i < 1; i++) {

      const num = "B" + myRandom(10000, 99999)
      console.log(num);

      this.billDetail.patchValue({
        bill_no: num,

      });

    }


  }

  addBill() {
    if (this.billDetail.valid) {
      this.billObj.nameuser = this.billDetail.value.nameuser;
      this.billObj.borrow_datetime = this.borrow_time;
      this.billObj.bill_no = this.billDetail.value.bill_no;
      this.billObj.project = this.billDetail.value.project;
      const product_bill = this.billObj.product_bill


      this.billObj.product_bill.forEach(item => {
        item.amount_return = item.amount;
      });


      console.log(product_bill, "สินค้าทุกอยากที่อยู่ในบิล");




      this.billService.addBill(this.billObj).subscribe(
        (res) => {
          Swal.fire(
            'เพิ่มข้อมูลสำเร็จ!',
            'เพิ่มข้อมูลในฐานข้อมูลเรียบร้อยแล้ว!',
            'success'
          );
          location.reload();


          this.getAllBill();
          this.barcode = '';
          this.billDetail.value.bill_no = '';
          this.billObj = new Bill();

          // แสดงค่า product_no ของทุกอินเด็กซ์ใน billList
          for (let i = 0; i <= this.billList.length + 1; i++) {
            console.log(this.billList[i]);
          }
          console.log(this.billList.length);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      Swal.fire('เกิดข้อผิดพลาด!', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      this.addBill()
    }
  }


  product_billEdit: any[] = []
  editBill(bill: Bill) {
    console.log("510", this.billList);

    this.billDetail.controls['_id'].setValue(bill._id);
    this.billDetail.controls['nameuser'].setValue(bill.nameuser);
    this.billDetail.controls['borrow_datetime'].setValue(bill.borrow_datetime);
    this.billDetail.controls['project'].setValue(bill.project);
    this.billDetail.controls['bill_no'].setValue(bill.bill_no);
    this.product_billEdit = bill.product_bill

  }




  //อัปเดทบิล
  updateBill() {

    this.billObj._id = this.billDetail.value._id;
    this.billObj.nameuser = this.billDetail.value.nameuser;
    this.billObj.borrow_datetime = this.billDetail.value.borrow_datetime;
    this.billObj.project = this.billDetail.value.project;
    this.billObj.bill_no = this.billDetail.value.bill_no;
    this.billObj.product_bill = this.product_billEdit


    this.billService.updateBill(this.billObj).subscribe(
      (res) => {
        Swal.fire(
          'แก้ไขข้อมูลสำเร็จ!',
          'ข้อมูลของคุณเป็นปัจจุบันเรียบร้อยแล้ว!',
          'success'
        );
        console.log(res);
        this.getAllBill();
        this.billDetail.reset();
      },
      (err) => {
        console.log(err);
      }
    );
  }


  //คืนสินค้า
  return(return_bill: Return_Bill) {
    // this.billObj.project = this.returnbill1.value.details;
    console.log(this.billList);

    this.returnbill1.controls['_id'].setValue(return_bill._id);
    this.returnbill1.controls['nameuser'].setValue(return_bill.nameuser);
    this.returnbill1.controls['borrow_datetime'].setValue(return_bill.borrow_datetime);
    this.returnbill1.controls['project'].setValue(return_bill.project);
    this.returnbill1.controls['bill_no'].setValue(return_bill.bill_no);
    this.returnbill1.controls['details'].setValue(return_bill.details);

    this.product_billEdit = return_bill.product_bill


  }



  //ยืนยันการคืน
  ok_return_bill() {

    this.return_billObj._id = this.returnbill1.value._id;
    this.return_billObj.nameuser = this.returnbill1.value.nameuser;
    this.return_billObj.borrow_datetime = this.returnbill1.value.borrow_datetime;
    this.return_billObj.project = this.returnbill1.value.project;
    this.return_billObj.bill_no = this.returnbill1.value.bill_no;

    this.return_billObj.details = this.returnbill1.value.details;
    this.return_billObj.product_bill = this.product_billEdit;

    console.log(this.return_billObj, "vvvv");


    this.returnService.ok_return_bill(this.return_billObj).subscribe(
      (res) => {
        Swal.fire(
          'คืนบิลสำเร็จ!',
          'คืนบิลเรียบร้อยแล้ว!',
          'success'
        );
        location.reload();
        console.log(res, "565");
        this.getAllBill();
        // this.returnbill1.reset();
      },
      (err) => {
        console.log(err);
      }
    );
  }





  clickdelete(bill: Bill) {
    Swal.fire({
      title: 'คุณยืนยันที่จะลบบิลนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBill(bill);
      }
    });
  }




  //ลบสินค้า
  deleteBill(bill: Bill) {
    this.billObj._id = bill._id;

    let datadelete = {
      _id: bill._id,
    };

    this.billService.deleteBill(datadelete).subscribe(
      (res: any) => {
        setTimeout(() => {
          // Delay 1 second before reloading
          location.reload();
        }, 1000); // Adjust the delay as needed

        Swal.fire('ลบข้อมูลสำเร็จ!', 'ข้อมูลของคุณลบเรียบร้อยแล้ว!', 'success');

        //console.log(res);
        this.getAllBill();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


  getCurrentDateTime(): string {
    const date = new Date();

    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      //second: 'numeric'
    });
  }


  //เเสดงข้อมูลทั้งหมด
  getAllBill() {
    this.billService.getAllBill().subscribe(
      (res) => {
        this.length_p = res.length;
        this.billList = res;
        this.billListtemp = res;
        this.columnsWithSearch = Object.keys(this.billList[0]);

        console.log(this.length_p);
        console.log(this.billList, "***ข้อมูลทั้งหมดในตารางตอนนี้***");
        this.dtTrigger.next(null);


        // // ใช้ลูปเพื่อเข้าถึงค่า "product_bill" ในแต่ละอ็อบเจ็กต์
        // for (var i = 0; i < this.billList.length; i++) {
        //   var productBill = this.billList[i].product_bill;



        // }

        // แสดงค่าใน billList
        for (let i = 0; i < this.billList.length; i++) {
          console.log(this.billList[i]);
        }

      },
      (err) => {
        console.log('error while fetching data.');
      }
    );


  }


  keysearch: any;

  columnsWithSearch: string[] = [];
  updateFilter() {
    let filterValue = this.keysearch;
    let filter = filterValue.toLowerCase();
    this.productList = this.productList.filter((item: { [x: string]: any; }) => {
      for (let i = 1; i < this.columnsWithSearch.length; i++) {
        var colValue = item[this.columnsWithSearch[i]];
        if (!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          return true;
        }
      }
      return false; // แก้ไขที่นี่: ต้องมีการ return false เมื่อไม่เข้าเงื่อนไขใดเลย
    });
  }




  viewdata: any
  view_bill(bill: any) {
    this.viewdata = bill
    this.viewdata.total = 0
    bill.product_bill.forEach((b: any) => {
      this.viewdata.total += b.amount
    })
    console.log(bill);

  }

  // returnbill() {

  // }
























}
