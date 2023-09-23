import fs from "fs/promises";

export default class ProductManager {
  id = 0;
  constructor() {
    this.path = "./src/db/products.json";
    this.productos = [];
    this.loadData();
  }

  async loadData() {
    try {
      const json = await fs.readFile(this.path, "utf-8");
      this.productos = JSON.parse(json);
      if (this.productos.length < 1) {
        this.id = 1;
      } else {
        this.id = this.productos[this.productos.length - 1].id + 1;
      }
    } catch {
      console.log(`el archivo ${this.path} no existe, creando...`);
      await fs.writeFile(this.path, "[]");
      return [];
    }
  }

  getProducts = async () => {
    const json = await fs.readFile(this.path, "utf-8");
    this.productos = JSON.parse(json);
    return this.productos;
  };

  async addProduct(product) {
    const json = await fs.readFile(this.path, "utf-8");
    this.productos = JSON.parse(json);
    const { title, description, price, thumbnail, code, stock } = product;

    const itsValid = this.productos.some(
      (productFind) => productFind.code === code
    );
    if (itsValid) {
      console.log(`ERROR: Code in use in ${product.title}`);
      return;
    }

    const productn = new Product(product);

    this.productos.push({
      id: this.id++,
      ...productn,
    });

    const newProduct = JSON.stringify(this.productos, null, 2);
    await fs.writeFile(this.path, newProduct);

    return `producto ${title} ingresado correctamente`;
  }

  async getProductById(id) {
    const json = await fs.readFile(this.path, "utf-8");
    this.productos = JSON.parse(json);
    const getProduct = this.productos.find((prod) => prod.id === id);
    if (getProduct) {
      return getProduct;
    }
    return "Producto Not found";
  }
  async updateProduct(id, product) {
    const json = await fs.readFile(this.path, "utf-8");
    this.productos = JSON.parse(json);
    const { title, description, price, thumbnail, code, stock } = product;

    const itsValid = this.productos.some((productFind) => productFind.id === id);
    if (!itsValid) {
      console.log(`ERROR: ID in use in ${product.title}`);
      return;
    }

    let update = this.productos.map((p) => {
      if (p.id === id) {
        return { ...p, ...product };
      }
      return p;
    });
    await fs.writeFile(this.path, JSON.stringify(update, null, 2));
  }

  async deleteProduct(id) {
    const json = await fs.readFile(this.path, "utf-8");
    this.productos = JSON.parse(json);
    const index = this.productos.findIndex((producto) => producto.id === id);
    if (index < 0) {
      return "Producto Not found";
    }

    this.productos.splice(index, 1);
    const newProducto = JSON.stringify(this.productos);
    await fs.writeFile(this.path, newProducto);
    return "Producto Eliminado Exitosamente";
  }
}

class Product {
  constructor(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}
const productManager = new ProductManager();