import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/carts.routes.js";
import { engine } from "express-handlebars";
import { viewRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

app.use("/src/public", express.static("./src/public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", viewRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const appServer = app.listen(8080, () => {
  console.log("server runnung 8080");
});

const socketServer = new Server(appServer);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente conectado");
  socket.on("message", (data) => {
    console.log(data);
  });

  socketServer.emit("messageAll", "Bienvenidos");
});