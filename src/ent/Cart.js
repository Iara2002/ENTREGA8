import { v4 as uuidv4 } from "uuid";

export class Cart {
  static id = uuidv4();
  constructor() {
    this.id = Cart.id;
    this.products = [];
  }
}