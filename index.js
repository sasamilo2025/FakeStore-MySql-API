const express = require('express');

const app = express();
app.use(express.json());

const products = [
  {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99
  }
];

app.get('/', (req, res) => {
  res.send('FakeStore API is running!');
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      error: 'Product not found'
    });
  }

  res.json(product);
});

app.post('/products', (req, res) => {
  console.log(req.body);

const newId = products.length + 1;

const newProduct = {
  id: newId,
  ...req.body
};

products.push(newProduct);

  res.json(newProduct);
});

// PUT /products/:id
// Updates an existing product using the ID from the URL
// and the new product information from req.body.
app.put('/products/:id', (req, res) => {
  // Convert the URL ID from a string into a number.
  const id = Number(req.params.id);

  // Find the product that matches the requested ID.
  const product = products.find(p => p.id === id);

  // If no product matches the ID, return a 404 error.
  if (!product) {
    return res.status(404).json({
      error: 'Product not found'
    });
  }

  // Update the existing product with the values
  // supplied in the request body.
  product.title = req.body.title;
  product.price = req.body.price;

  // Send the updated product back to the client.
  res.json(product);
});

// DELETE /products/:id
// Removes an existing product using the ID from the URL.
app.delete('/products/:id', (req, res) => {
  // Convert the URL ID from a string into a number.
  const id = Number(req.params.id);

  // Find the position (index) of the product in the array.
  const productIndex = products.findIndex(p => p.id === id);

  // If no product matches the ID, return a 404 error.
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Product not found'
    });
  }

  // Remove one product from the array at the matching index.
  const deletedProduct = products.splice(productIndex, 1);

  // Return the deleted product as confirmation.
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct[0]
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});