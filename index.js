const express = require('express');

// Import the MySQL connection pool from db.js.
// This allows our Express routes to communicate with MySQL.
const db = require('./db');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('FakeStore API is running!');
});

// GET /products
// Retrieves all products directly from the MySQL database.
app.get('/products', (req, res) => {
  // Query the products table and return all rows.
  db.query('SELECT * FROM products', (err, results) => {
    // If MySQL returns an error, send a server error response.
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({
        error: 'Database error'
      });
    }

    // Send the products retrieved from MySQL as JSON.
    res.json(results);
  });
});

// GET /products/:id
// Retrieves one product from MySQL using the ID supplied in the URL.
app.get('/products/:id', (req, res) => {
  // Convert the URL ID from a string into a number.
  const id = Number(req.params.id);

  // Use a parameterized query to safely insert the ID into the SQL statement.
  // The ? placeholder is replaced by the value in the [id] array.
  db.query(
    'SELECT * FROM products WHERE id = ?',
    [id],
    (err, results) => {
      // If MySQL returns an error, send a server error response.
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({
          error: 'Database error'
        });
      }

      // If no product matches the requested ID, return a 404 response.
      if (results.length === 0) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      // Return the matching product as JSON.
      res.json(results[0]);
    }
  );
});

// POST /products
// Creates a new product in the MySQL database.
app.post('/products', (req, res) => {
  // Get the product information sent by the client.
  const { title, price } = req.body;

  // Insert the new product into the MySQL products table.
  // The ? placeholders are safely replaced by the values
  // supplied in the array below.
  const sql = 'INSERT INTO products (title, price) VALUES (?, ?)';

  db.query(sql, [title, price], (err, result) => {
    // If MySQL returns an error, send a server error response.
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({
        error: 'Database error'
      });
    }

    // MySQL automatically creates the new ID because
    // the products.id column uses AUTO_INCREMENT.
    const newProduct = {
      id: result.insertId,
      title: title,
      price: price
    };

    // Return the newly created product to the client.
    res.status(201).json(newProduct);
  });
});

// PUT /products/:id
// Updates an existing product in the MySQL database.
app.put('/products/:id', (req, res) => {
  // Convert the URL ID from a string into a number.
  const id = Number(req.params.id);

  // Get the updated product information from the request body.
  const { title, price } = req.body;

  // Update the matching product in the MySQL products table.
  // The ? placeholders are safely replaced by the values
  // supplied in the array below.
  const sql = `
    UPDATE products
    SET title = ?, price = ?
    WHERE id = ?
  `;

  db.query(sql, [title, price, id], (err, result) => {
    // If MySQL returns an error, send a server error response.
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({
        error: 'Database error'
      });
    }

    // If no row was updated, the requested product does not exist.
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    // Return the updated product to the client.
    res.json({
      id: id,
      title: title,
      price: price
    });
  });
});

// DELETE /products/:id
// Removes an existing product from the MySQL database.
app.delete('/products/:id', (req, res) => {
  // Convert the URL ID from a string into a number.
  const id = Number(req.params.id);

  // Delete the product that matches the supplied ID.
  // The ? placeholder is safely replaced by the ID
  // supplied in the [id] array below.
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    // If MySQL returns an error, send a server error response.
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({
        error: 'Database error'
      });
    }

    // If no row was deleted, the requested product does not exist.
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    // Confirm that the product was successfully deleted.
    res.json({
      message: 'Product deleted successfully',
      id: id
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});