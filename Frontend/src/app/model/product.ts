export class Product {

   _id:  number = 0;
    barcode : String = '';
    model:String = '';
    product_name: String = '';
    brand:String = '';
    amount:  number = 0;
    product_no: string = '';
    picture: string = '';
    time_product: {
      time_add: string;
      time_update: string;
      time_delete: string;
  } = {
      time_add: '',
      time_update: '',
      time_delete: '',
  };

}
