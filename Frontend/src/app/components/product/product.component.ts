import { Component, ElementRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../model/product';
import { ProductService } from '../../service/product.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import Swal from 'sweetalert2';
import * as JsBarcode from 'jsbarcode';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService],
})
export class ProductComponent implements OnInit{

  fileInput!: ElementRef;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  // กำหนดค่า immages (24-29)


  images: any[] = [];
  productPic: HTMLImageElement | undefined;
  inputFile: HTMLInputElement | undefined;

  selectedFile: File | null = null;


  items: { imageUrl: string, fileName: string }[] = [];

  [x: string]: any;
  url: string = '';
  body: any;


  // วัน/เดือน/ปี เเละวันที่ เพิ่ม แก้ไข ลบ สินค้า


  time_n: string = "";
  day_y: string = "";


  length_p: number = 0;
  count1: string = "";
  productDetail !: FormGroup;
  productDetail1 !: FormGroup;
  productObj: Product = new Product();
  productList: any;
  productListtemp: any[] = [];
  row: any;
  filteredData: any[] = [];
  isButtonHidden: boolean = false;
  isButtonHidden1: boolean = true;
  product_data: any;
  rowNumber = 1;
  product: string = "";

  files: File | null = null;
  filePath = ""
  value: any = {};


  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();





  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient,
  ){

  }



  ngOnInit(): void {

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


    this.getAllProduct();
    this.productList
    this.productDetail1 = this.formBuilder.group({
      _id: [''],
      barcode: [''],
      product_no: [''],
      model: [''],
      product_name: [''],
      brand: [''],
      amount: [''],
      picture: [''],
      time_product: this.formBuilder.group({
        time_add: [''],
        time_update: [''],
        time_delete: ['']
      })



    });


    // สร้าง Product สำหรับ PR00001 และเก็บ _id ไว้ใน productObj

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


  resetImage() {
    this.url = '';
    this.fileInput.nativeElement.value = ''; // รีเซ็ตค่า "เลือกไฟล์" เป็นค่าว่าง
  }

  clear_edit() {
    this.productDetail1.reset();
    this.resetImage()
  }


    //เเสดงข้อมูลทั้งหมด
    getAllProduct() {

      this.productDetail = this.formBuilder.group({
        _id: [''],
        barcode: [''],
        product_no: [''],
        model: [''],
        product_name: [''],
        brand: [''],
        amount: [''],
        picture: [''],

        time_product: this.formBuilder.group({
          time_add: [''],
          time_update: [''],
          time_delete: ['']
        })



      });




      this.productDetail.patchValue({
        product_no: "PR00001",
        //timebill: this.day_y
      });
      // this.productCodes="PR00001"


      this.productService.getAllProduct().subscribe(res => {


        this.length_p = res.length;
        this.productList = res;
        console.log(this.productList, "productList");

        this.productListtemp = res;
        // this.columnsWithSearch = Object.keys(this.productList[0]);

        const formattedNumber = String(this.length_p + 1).padStart(5, '0'); //เพิ่ม 0 ไว้ด้านหน้าจะได้ 00001
        const productCode = `PR${formattedNumber}`; //PR00001
        console.log(productCode);

        // this.productCodes = productCode


        this.productDetail.patchValue({
          product_no: productCode,
          //timebill: this.day_y
        });


        console.log(this.productListtemp);
        console.log(this.length_p);
        this.dtTrigger.next(null);


      }, err => {
        console.log("error while fetching data.")

      });

    }



    onSelect(event: any) {
      this.url = 'https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png'; // รูปภาพตั้งต้นก่อนที่จะเลือกแต่ภาพมไม่ขึ้น
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
          console.log(base64file, "64 file");

          console.log(base64file, filename, " <<< ค่าไฟล์รูปภาพ Base64");

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
      this.productObj.picture = this.body;
    }



    currentProductNumber = 1;
    productCodes: string = '';


    clear() {
      this.productDetail.reset({
        product_no: this.productCodes,
        product_name: '',
        picture: '',
        previews: '',
        model: '',
        brand: '',
        amount: ''


      }) // ลบข้อมูลที่มีอยู่ใน input box
    }


    close() {
      this.isButtonHidden = false; // กดปิดเเล้วปุ่มถูกหายไป
      this.isButtonHidden1 = true;
    }


    generateBarcode(productNo: string) {
      const svgId = productNo;

      JsBarcode('#' + svgId, productNo, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: true,
        background: '#DCDCDC',
      });
      //console.log(productNo);


    }



  generateBarcodes() {

    for (const product of this.productList) {
      const productCode = product.product_no;
      const svgId = product.product_no;


      JsBarcode('#' + svgId, productCode, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: true,
      });


      //console.log('Generated barcode for product:', productCode, 'SVG ID:', svgId);

      // totalBarcodes.push(productCode); // เพิ่มบาร์โค้ดลงในอาร์เรย์
    }
    /*
      console.log('จำนวนทั้งหมดของบาร์โค้ดที่ถูกสร้าง: ', totalBarcodes.length);
      for (const barcode of totalBarcodes) {
        console.log(barcode);
      }
    */
  }




  printBarcode() {
    // สร้างและแสดงบาร์โค้ดก่อนพิมพ์
    this.generateBarcodes();

    // // เมื่อสร้างบาร์โค้ดแล้ว คุณสามารถเรียกใช้คำสั่งพิมพ์หน้าเว็บได้
    // window.print();

    // กำหนดให้บาร์โค้ดเป็นซ่อน
    this.productList.forEach((product: { showBarcode: boolean; }) => {
      product.showBarcode = false;
    });
  }




  addProduct() {
    // this.saveimg();

    if (this.productDetail.valid) {


      this.productObj.product_no = this.productDetail.value.product_no;
      const productCode = this.productObj.product_no;
      this.productObj.barcode = productCode;
      this.productObj.model = this.productDetail.value.model;
      this.productObj.product_name = this.productDetail.value.product_name;
      this.productObj.brand = this.productDetail.value.brand;
      this.productObj.amount = this.productDetail.value.amount;
      //this.add_pic(); //ค่าชื่อรูปภาพ


      this.productService.addProduct(this.productObj).subscribe(


        res => {
          console.log(this.productObj);
          console.log(res);


          /*
                    setTimeout(() => {

                      location.reload();
                    }, 1000); // ดีย์เล 1 วิ
          */


          Swal.fire(
            'เพิ่มข้อมูลสำเร็จ!',
            'เพิ่มข้อมูลในฐานข้อมูลเรียบร้อยแล้ว!',
            'success'
          )

          //console.log(this.productObj);
          this.getAllProduct();
          this.productDetail.reset();
          window.location.reload();

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


    //แก้ไขสินค้า
    editProduct(product: Product) {
      //this.isButtonHidden = true;
      //this.isButtonHidden1 = false;
      this.productDetail1.controls['_id'].setValue(product._id);
      this.productDetail1.controls['picture'].setValue(product.picture)
      this.productDetail1.controls['product_no'].setValue(product.product_no);
      this.productDetail1.controls['model'].setValue(product.model);
      this.productDetail1.controls['product_name'].setValue(product.product_name);
      this.productDetail1.controls['brand'].setValue(product.brand);
      this.productDetail1.controls['amount'].setValue(product.amount);

    }

  //อัปเดทสินค้า
  updateProduct() {
    //this.isButtonHidden = false;
    //this.isButtonHidden1 = true;
    this.productObj._id = this.productDetail1.value._id;
    this.productObj.picture = this.body;
    this.productObj.product_no = this.productDetail1.value.product_no;
    this.productObj.model = this.productDetail1.value.model;
    this.productObj.product_name = this.productDetail1.value.product_name;
    this.productObj.brand = this.productDetail1.value.brand;
    this.productObj.amount = this.productDetail1.value.amount;
    this.productService.updateProduct(this.productObj).subscribe(
      res => {


        Swal.fire(
          'แก้ไขข้อมูลสำเร็จ!',
          'ข้อมูลของคุณเป็นปัจจุบันเรียบร้อยแล้ว!',
          'success'
        );

        this.getAllProduct();
        window.location.reload();

      },
      err => {
        console.log(err);
      }
    );
  }


  clickdelete(product: Product) {

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
        this.deleteProduct(product);
      }
    })

  }


   //ลบสินค้า
   deleteProduct(product: Product) {
    this.productObj._id = product._id;

    let datadelete = {
      _id: product._id,
    };

    this.productService.deleteProduct(datadelete).subscribe(
      (res: any) => {

        Swal.fire('ลบข้อมูลสำเร็จ!', 'ข้อมูลของคุณลบเรียบร้อยแล้ว!', 'success');

        //console.log(res);
        this.getAllProduct();

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
        this.length_p +1;




      },
      (err: any) => {
        console.log(err);
      }
    );
  }





}
