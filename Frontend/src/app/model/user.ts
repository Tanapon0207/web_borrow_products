export class User {

  _id:  number = 0;
  picture: string = ''
  name : string =''
  email : string =''
  phone : string =''
  username : string =''
  password : string =''
  confirmpassword : string =''
  role: Role[] = [];


}


export class Role {
  User: string ='';
  Admin: string= '';
}

