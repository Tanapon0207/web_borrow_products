export class Return_Bill {

  _id: number = 0;
  bill_no: string = '';
  nameuser: String = '';
  borrow_datetime: String = '';
  project: String = '';
  details: String = '';
  product_bill: productAll[] = [];
}


export class productAll {
  product_no: string = '';
  product_name: string = '';
  brand: string = '';
  model: string = '';
  amount: number = 0
  amount_return: number = 0
}
