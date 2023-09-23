import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = express.Router();

// Ruta raíz GET /products
productsRouter.get('/', (req, res) => {
  // Obtener los productos del archivo productos.json
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));

  // Aplicar la limitación si se proporciona el parámetro 'limit'
  const limit = req.query.limit;
  let response = products;

  if (limit) {
    response = products.slice(0, parseInt(limit));
  }

  res.json(response);
});

// Ruta GET /products/:pid
productsRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  // Obtener los productos del archivo productos.json
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));

  // Buscar el producto con el ID proporcionado
  const product = products.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Ruta POST /products
productsRouter.post('/', (req, res) => {
  // Obtener los productos del archivo productos.json
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));

  // Generar un nuevo ID para el producto utilizando uuidv4
  const newProductId = uuidv4();

  // Crear el nuevo producto con los campos proporcionados en el body de la solicitud
  const newProduct = {
    id: newProductId,
    ...req.body,
  };

  // Agregar el nuevo producto al arreglo de productos
  products.push(newProduct);

  // Guardar los productos actualizados en el archivo productos.json
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(newProduct);
});

// Ruta PUT /products/:pid
productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;

  // Obtener los productos del archivo productos.json
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));

  // Buscar el producto con el ID proporcionado
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex !== -1) {
    // Actualizar los campos del producto con los datos proporcionados en el body de la solicitud
    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
    };

    // Guardar los productos actualizados en el archivo productos.json
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Ruta DELETE /products/:pid
productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  // Obtener los productos del archivo productos.json
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));

  // Buscar el producto con el ID proporcionado
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex !== -1) {
    // Eliminar el producto del arreglo de productos
    const deletedProduct = products.splice(productIndex, 1)[0];

    // Guardar los productos actualizados en el archivo productos.json
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Registrar el enrutador de productos en el grupo de rutas '/api/products'
app.use('/api/products', productsRouter);

const cartsRouter = express.Router();

// Ruta POST /carts
cartsRouter.post('/', (req, res) => {
  // Generar un nuevo ID para el carrito utilizando uuidv4
  const newCartId = uuidv4();

  // Crear el nuevo carrito con el ID generado y sin productos inicialmente
  const newCart = {
    id: newCartId,
    products: [],
  };

  // Guardar el nuevo carrito en el archivo carrito.json
  fs.writeFileSync('carrito.json', JSON.stringify(newCart, null, 2));

  res.json(newCart);
});

// Ruta GET /carts/:cid
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  // Obtener el carrito del archivo carrito.json
  const cart = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));

  if (cart.id === cartId) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Ruta POST /carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  // Obtener el carrito del archivo carrito.json
  const cart = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));

  if (cart.id === cartId) {
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(
      (product) => product.product === productId
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar la cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no existe, agregarlo al carrito
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    // Guardar el carrito actualizado en el archivo carrito.json
    fs.writeFileSync('carrito.json', JSON.stringify(cart, null, 2));

    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Registrar el enrutador de carritos en el grupo de rutas '/api/carts'
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});