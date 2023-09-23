import fs from "fs/promises";
import { Product } from "./ent/Product.js";

export default class ProductManager {
  id = 0;
  constructor() {
    this.products = [];
    this.path = "../src/db/products.json";
    this.loadData();
  }

  async loadData() {
    try {
      const json = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(json);
      if (this.products.length < 1) {
        this.id = 1;
      } else {
        this.id = this.products[this.products.length - 1].id + 1;
      }
    } catch {
      console.log(`el archivo ${this.path} no existe, creando...`);
      await fs.writeFile(this.path, "[]");
      return [];
    }
  }

  getProducts = async () => {
    const json = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(json);
    return this.products;
  };

  async addProduct(product) {
    const json = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(json);

    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category,
    } = product;

    if (
      title === "" ||
      description === "" ||
      price === "" ||
      code === "" ||
      stock === "" ||
      category === ""
    ) {
      return "Los campos son obligatorios";
    }

    const productn = new Product(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    );
    console.log(productn);

    const itsValid = this.products.some(
      (productFind) => productFind.code === code
    );
    if (itsValid) {
      console.log(`ERROR: Code in use in ${product.title}`);
      return;
    }

    

    this.products.push({
      id: this.id++,
      ...productn,
    });

    const newProduct = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.path, newProduct);

    return {
      id: this.id - 1,
      msg: `producto ${title} ingresado correctamente`,
    };
  }

  async getProductById(id) {
    const json = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(json);

    const getProduct = this.products.find((prod) => prod.id === Number(id));
    if (getProduct) {
      return getProduct;
    }
    return "Producto Not found";
  }
  async updateProduct(id, product) {
    const json = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(json);
    const { title, description, price, thumbnail, code, stock, category } =
      product;

    const itsValid = this.products.some(
      (productFind) => productFind.id === Number(id)
    );

    if (!itsValid) {
      console.log(`ERROR: ID in use in ${product.title}`);
      return;
    }

    let update = this.products.map((p) => {
      if (p.id === Number(id)) {
        return { ...p, ...product };
      }
      return p;
    });
    await fs.writeFile(this.path, JSON.stringify(update, null, 2));
  }

  async deleteProduct(id) {
    const json = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(json);
    const index = this.products.findIndex(
      (producto) => producto.id === Number(id)
    );
    if (index < 0) {
      return "Producto Not found";
    }

    this.products.splice(index, 1);
    const newProducto = JSON.stringify(this.products);
    await fs.writeFile(this.path, newProducto);
    return "Producto Eliminado Exitosamente";
  }
}