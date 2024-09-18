import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Product } from '../model/product';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productList() {
    throw new Error('Method not implemented.');
  }
/*
  filter(arg0: (u: any) => boolean): UserService {
    throw new Error('Method not implemented.');
  }
  */


  addProductURL : string;
  getProductURL : string;
  updateProductURL : string;
  deleteProductURL : string;
  backProductURL : string;

  constructor(private http:HttpClient) {
    this.addProductURL = 'http://localhost:9100/product/create';
    this.getProductURL = 'http://localhost:9100/product';
    this.updateProductURL = 'http://localhost:9100/product/update';
    this.deleteProductURL = 'http://localhost:9100/product/delete';
    this.backProductURL = 'http://localhost:9100/product/back';

   }

   addProduct(product : Product) : Observable<Product> {

    return this.http.post<Product>(this.addProductURL,product);
   }




   getAllProduct(): Observable<Product[]> {

    return this.http.get<Product[]>(this.getProductURL);



   }


   updateProduct(product :Product) : Observable<Product>{
    return this.http.post<Product>(this.updateProductURL, product);
  }

/*
  deleteCar(car: Car): Observable<Car> {
    return this.http.delete<Car>(this.deleteCarURL + '/' + car._id);
  }
*/

  deleteProduct(product: any): Observable<Product> {
console.log(product)
    return this.http.post<Product>(this.deleteProductURL, product);

  }


  backProduct(product: any): Observable<Product> {
    console.log(product)
    return this.http.post<Product>(this.backProductURL, product);

  }



}
