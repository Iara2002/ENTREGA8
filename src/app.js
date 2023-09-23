import express from "express";
import ProductManager from "./src/ProductManager";

const app = express();
const manager = new ProductManager('products.json');

app.get("/productos", async (req, res) => {
  const { limit } = req.query;
  const productos = await manager.getProducts();
  if (limit) {
    res.send(productos.splice(0, +limit));
  } else {
    res.send(productos);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: ' server error' });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});