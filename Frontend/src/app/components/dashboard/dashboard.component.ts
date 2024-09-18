import { Component, OnInit , HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../service/product.service';
import { BillService } from '../../service/bill.service';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  // productCounts: { product_no: string, count: number }[] = []; // เพิ่มตัวแปร productCounts
  // ในคอมโพเนนต์ DashboardComponent


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.drawChart();
  }

  barChartData: any[] = [];

  // top5ProductNos: { product_no: string, count: number }[] = [];

  productCounts: { product_name: string, count: number }[] = [];
  top5ProductNos: { product_name: string, count: number }[] = [];


  amount_product: number = 0;
  amount_bill: number = 0;
  amount_user: number = 0;


  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private billService: BillService,
    private userService: UserService,
    private route: ActivatedRoute

  ){}



  // เปิดหน้าเว็บเเล้วให้โหลดกราฟ
  ngOnInit(): void {

    this.getdata();
    this.getdata_dashboard();

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {

      setTimeout(() => {
        this.drawChart();

      }, 1500);  //ดีเลย์เวลาการโหลด 1500


      this.drawChart();
    })


    this.route.queryParams.subscribe(params => {
      if (params['refresh']) {
        this.refreshPage();
      }
    });


  }



  refreshPage() {
    window.location.reload();
    // รีเฟรทหน้าจอ
  }



  drawChart() {
    // สร้างข้อมูลสำหรับแผนภูมิ
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'ชื่อสินค้า');
    data.addColumn('number', 'จำนวน');

    // เพิ่มข้อมูลจาก top5ProductNos
    this.top5ProductNos.forEach(product => {
      // console.log(product.count)
      for (let i = 0; i < product.count; i++) {

      }
      data.addRow([product.product_name, product.count]); //fig รหัสสินค้า กับ จำนวนสินค้า


    });

    // กำหนดตัวเลือกของแผนภูมิ
    const options = {
      title: 'สินค้าที่ยืมเยอะที่สุด 5 อันดับ', //ชื่อหัวข้อกราฟ
      vAxis: { title: 'จำนวนครั้งที่ยืม (Count)', maxValue: 50 }, // แกนแนวตั้ง
      hAxis: { title: 'ชื่อสินค้า (Product_name)', titleTextStyle: { color: 'black' }/*สีข้อความสีดำ*/ }, // แกนแนวนอน
      colors: ['#9575cd'],
      is3D: true,


      animation: // กำหนดการเคลื่อนไหวของกราฟ
      {
        "startup": true,
        duration: 2000,
        easing: 'out',


      },
    };

    // สร้างแผนภูมิแท่งแนวตั้ง
    const chart = new google.visualization.ColumnChart(document.getElementById('barchart_values'));
    chart.draw(data, options);


  }


  // ดึงข้อมูลมาจาก locolhost มาเเสดงผลข้อมูล
  getdata() {


    this.productService.getAllProduct().subscribe((data_product: any) => {
      this.amount_product = data_product.length;
    });

    this.billService.getAllBill().subscribe((data_bill: any) => {
      this.amount_bill = data_bill.length;
    });

    this.userService.getAllUser().subscribe((data_user: any) => {
      this.amount_user = data_user.length;
    });


  }

    // สร้างแผนภูมิเเท่ง
    getdata_dashboard() {


      this.billService.getBillDashboard().subscribe((data_bill) => {
        // this.amount_bill = data_bill.length;

        // console.log(this.amount_bill);

        // นับจำนวนครั้งของการยืมสินค้าตาม product_no
        const productCountsMap: Map<string, number> = new Map<string, number>();

        console.log(productCountsMap);



        data_bill.forEach((product_bill) => {
          product_bill.product_bill.forEach((product) => {
            const productNo = product.product_name;
            const count = productCountsMap.get(productNo) || 0;
            productCountsMap.set(productNo, count + 1);
          });
        });

        // แปลง Map เป็นรายการสินค้าที่นับแล้ว
        this.productCounts = Array.from(productCountsMap.entries()).map(([product_name, count]) => ({
          product_name: product_name,
          count: count

        }));


        // console.log(this.productCounts); //แสดงรหัสสินค้าทั้งหมด จำนวนการยืมทั้งหมด

        // จัดเรียงตามจำนวนครั้งการยืมและเลือกเฉพาะ 5 อันดับแรก
        this.top5ProductNos = this.productCounts
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        console.log(this.top5ProductNos); //เป็นการเเสดงผล 5 อันดับเเรก
        console.log(this.top5ProductNos[0]);


      });

    }















}
