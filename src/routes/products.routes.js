import { Router } from "express";
import ProductManager from "../ProductManager.js";

export const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (limit) {
    res.json({
      status: true,
      data: products.splice(0, +limit),
    });
  } else {
    res.json({
      status: true,
      data: products,
    });
  }
});

productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const product = await productManager.getProductById(id);

  res.json({
    status: true,
    data: product,
  });
});

productsRouter.post("/", async (req, res) => {
  const newproduct = req.body;
  const result = await productManager.addProduct(newproduct);

  res.json({
    status: true,
    data: result.msg,
    id: result.id,
  });
});

productsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await productManager.updateProduct(id, req.body);

  res.json({
    status: true,
    data: result,
  });
});

productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await productManager.deleteProduct(id);
  res.json({
    status: true,
    dsg: "Producto Eliminado",
  });
});