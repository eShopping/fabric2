import { Product } from "../../../shared/models/product";

export class Order {
    firstname:string;
    lastname:string;
    address:string;
    email:string;
    phone:string;
    items:Product[];
    totalamount:string;


}

