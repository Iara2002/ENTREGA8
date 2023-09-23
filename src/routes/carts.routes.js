import { Router } from "express";
import { CartManager } from "../../CartManager.js";

export const cartRouter = Router();
const cartManager = new CartManager();

//Crea el carrito
cartRouter.get("/", async (req, res) => {
  const carts = await cartManager.createCart();

  res.json({
    status: true,
    msg: carts,
  });
});

//Agregar Producto

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const result = await cartManager.addProduct(cid, pid);

  res.json({
    status: true,
    msg: result,
  });
});

//Ver carrito
cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCart(cid);
  res.json({
    status: true,
    msg: cart,
  });
});