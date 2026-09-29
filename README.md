# FakeStore MySQL API

A RESTful CRUD API built with **Node.js, Express, and MySQL**.

This mini-project started as an Express API using in-memory product data and was later migrated to a **MySQL database** for persistent data storage.

The project demonstrates how a backend API can perform **Create, Read, Update, and Delete (CRUD)** operations against a relational database.

## Project Goals

* Build a RESTful API using Express
* Implement CRUD operations for products
* Connect a Node.js application to MySQL
* Store product data persistently in a MySQL database
* Use environment variables to protect database credentials
* Use parameterized SQL queries for database operations
* Test the API using `curl`
* Manage the project using Git and GitHub

## Technologies Used

### Backend

* **Node.js** — JavaScript runtime used to run the backend application
* **Express 5** — Web framework used to build the REST API
* **MySQL 8** — Relational database used for persistent product storage
* **mysql2** — Node.js driver used to connect the application to MySQL
* **dotenv** — Loads database configuration from environment variables

### Development Tools

* **Git** — Version control
* **GitHub** — Remote repository and project backup
* **VS Code** — Code editor
* **curl** — Used to test API endpoints from the terminal

## Project Structure

```text
FakeStore-MySql-API/
│
├── db.js                 # MySQL connection pool
├── index.js              # Express server and API routes
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Locked dependency versions
├── .env                  # Local database configuration (not committed)
├── .gitignore            # Files excluded from Git
└── README.md             # Project documentation
```

### File Responsibilities

**`index.js`**

The main Express application file. It:

* Creates the Express server
* Enables JSON request handling
* Defines the REST API routes
* Handles CRUD operations
* Sends HTTP responses to the client

**`db.js`**

The database connection module. It:

* Loads environment variables using `dotenv`
* Creates a MySQL connection pool using `mysql2`
* Exports the pool for use by `index.js`

**`.env`**

Stores local database configuration such as the database host, username, password, and database name.

The `.env` file is excluded from Git so that database credentials are not committed to the repository.

### Application Flow

```text
Client / curl
      │
      ▼
Express Server
      │
      ▼
index.js
      │
      ▼
db.js
      │
      ▼
MySQL Database
      │
      ▼
products table
```

## Database Setup

This project uses **MySQL 8** to store product data persistently.

### 1. Create the Database

Create a MySQL database for the project:

```sql
CREATE DATABASE fakestore;
```

Select the database:

```sql
USE fakestore;
```

### 2. Create the Products Table

Create the `products` table:

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

The table contains three fields:

| Field   | Type           | Purpose                                   |
| ------- | -------------- | ----------------------------------------- |
| `id`    | INT            | Unique product ID generated automatically |
| `title` | VARCHAR(255)   | Product name                              |
| `price` | DECIMAL(10, 2) | Product price                             |

### 3. Configure Environment Variables

Create a local `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=fakestore
```

Replace the placeholder values with your own local MySQL credentials.

**Do not commit your `.env` file to GitHub.**

The project `.gitignore` excludes `.env` so database credentials remain private.

### 4. Install Dependencies

After cloning the repository, install the project dependencies:

```bash
npm install
```

This installs the dependencies listed in `package.json`, including:

* Express
* mysql2
* dotenv

## API Endpoints

The API provides CRUD operations for products.

### Base URL

```text
http://localhost:3000
```

### Product Routes

| Method | Endpoint        | CRUD Operation | Description                |
| ------ | --------------- | -------------- | -------------------------- |
| GET    | `/products`     | Read           | Retrieve all products      |
| GET    | `/products/:id` | Read           | Retrieve one product by ID |
| POST   | `/products`     | Create         | Add a new product          |
| PUT    | `/products/:id` | Update         | Update an existing product |
| DELETE | `/products/:id` | Delete         | Delete a product           |

### GET All Products

```http
GET /products
```

Returns all products stored in the MySQL `products` table.

Example:

```json
[
  {
    "id": 1,
    "title": "Fjallraven Backpack",
    "price": "109.95"
  }
]
```

### GET Product by ID

```http
GET /products/2
```

Returns the product matching the supplied ID.

If the product does not exist, the API returns:

```json
{
  "error": "Product not found"
}
```

### POST Create Product

```http
POST /products
```

Example request body:

```json
{
  "title": "Bridge Test Product",
  "price": 19.99
}
```

The product is inserted into MySQL and a new ID is generated automatically.

### PUT Update Product

```http
PUT /products/2
```

Example request body:

```json
{
  "title": "Updated Product",
  "price": 24.99
}
```

The matching product is updated in the MySQL database.

### DELETE Product

```http
DELETE /products/2
```

Deletes the product matching the supplied ID.

If the product does not exist, the API returns:

```json
{
  "error": "Product not found"
}
```

## Running the API

### 1. Start the Server

From the project directory, run:

```bash
node index.js
```

The server should start at:

```text
http://localhost:3000
```

You should see:

```text
Server running on http://localhost:3000
```

### 2. Test the API

The API can be tested using `curl` from a terminal.

#### Get all products

```bash
curl http://localhost:3000/products
```

#### Get one product

```bash
curl http://localhost:3000/products/2
```

#### Create a product

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Example Product","price":19.99}'
```

#### Update a product

```bash
curl -X PUT http://localhost:3000/products/2 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Product","price":24.99}'
```

#### Delete a product

```bash
curl -X DELETE http://localhost:3000/products/2
```

### Stop the Server

To stop the running server, press:

```text
Ctrl + C
```

## MySQL Migration

The original version of this project stored products in an **in-memory JavaScript array**.

This worked for learning how to build Express CRUD routes, but the data was lost whenever the server restarted.

The project was then migrated to **MySQL** so that product data could be stored persistently.

### Before Migration

The original application stored products directly in `index.js`:

```text
Express API
    │
    ▼
JavaScript Array
    │
    ▼
Product Data
```

The main limitation was that the data only existed while the Node.js application was running.

### After Migration

The application now uses MySQL for persistent storage:

```text
Client / curl
      │
      ▼
Express API
      │
      ▼
index.js
      │
      ▼
db.js
      │
      ▼
MySQL
      │
      ▼
products table
```

Product data now remains available after the Node.js server is stopped and restarted.

### What Changed

The migration introduced several important backend concepts:

#### 1. MySQL Database

A relational database was introduced to store product records permanently.

The `products` table contains:

* `id`
* `title`
* `price`

The `id` field uses `AUTO_INCREMENT` so MySQL generates a unique ID when a new product is created.

#### 2. mysql2

The `mysql2` package allows the Node.js application to communicate with MySQL.

The Express routes can send SQL queries to the database through the MySQL connection pool.

#### 3. Database Connection Pool

The database connection is created in `db.js`.

A connection pool allows the application to reuse database connections instead of creating a new connection for every request.

This keeps database access organised and is more suitable for an API than managing individual connections manually.

#### 4. Environment Variables

Database configuration is stored in the `.env` file rather than directly inside the source code.

For example:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=fakestore
```

This keeps sensitive database credentials separate from the application code.

The `.env` file is excluded from Git using `.gitignore`.

#### 5. Parameterized SQL Queries

The API uses `?` placeholders in SQL queries.

For example:

```js
db.query(
  'SELECT * FROM products WHERE id = ?',
  [id],
  callback
);
```

The value is supplied separately from the SQL statement.

Parameterized queries help prevent SQL injection and are an important database security practice.

### Key Learning Points

This migration provided practical experience with:

* Building RESTful CRUD endpoints with Express
* Connecting Node.js to MySQL
* Designing a basic relational database table
* Using a MySQL connection pool
* Writing SQL queries from a Node.js application
* Using parameterized queries
* Managing database credentials with environment variables
* Handling database errors
* Returning appropriate HTTP status codes such as `201`, `404`, and `500`
* Testing API behaviour using `curl`
* Using Git and GitHub to track and back up the project

### Main Lesson

The most important lesson from the migration was understanding the difference between **temporary application data** and **persistent database data**.

```text
In-Memory Data
     │
     ▼
Lost when the server stops

MySQL Data
     │
     ▼
Persists after the server stops
```

This demonstrates a fundamental backend development pattern:

**The API handles the requests and business logic, while the database provides persistent storage.**

## Testing & Results

The API was manually tested using `curl` commands from the terminal.

Testing verified that the Express API could successfully communicate with the MySQL database and perform all CRUD operations.

### GET All Products

The `GET /products` endpoint was tested to confirm that products could be retrieved from MySQL.

```bash
curl http://localhost:3000/products
```

The API successfully returned the products stored in the MySQL `products` table.

### GET Product by ID

The `GET /products/:id` endpoint was tested using an existing product ID.

```bash
curl http://localhost:3000/products/2
```

The API successfully returned the matching product.

### GET Non-Existing Product

A non-existing product ID was tested to verify error handling.

```bash
curl http://localhost:3000/products/99
```

The API correctly returned:

```json
{
  "error": "Product not found"
}
```

This confirmed that the API returns a `404 Not Found` response when a product does not exist.

### POST Create Product

A new product was created using:

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Bridge Test Product","price":19.99}'
```

The API successfully inserted the product into MySQL and returned the newly generated product ID.

### PUT Update Product

The newly created test product was then updated:

```bash
curl -X PUT http://localhost:3000/products/5 \
  -H "Content-Type: application/json" \
  -d '{"title":"Bridge Updated Product","price":24.99}'
```

The API successfully updated the existing MySQL record.

A subsequent `GET` request confirmed that the updated values had been stored.

### DELETE Product

The test product was then deleted:

```bash
curl -X DELETE http://localhost:3000/products/5
```

The API returned a successful deletion response.

A final `GET` request confirmed that the product no longer existed and returned:

```json
{
  "error": "Product not found"
}
```

### Test Summary

| Test                     | Result   |
| ------------------------ | -------- |
| GET all products         | ✅ Passed |
| GET product by ID        | ✅ Passed |
| GET non-existing product | ✅ Passed |
| POST create product      | ✅ Passed |
| PUT update product       | ✅ Passed |
| DELETE product           | ✅ Passed |
| Verify deleted product   | ✅ Passed |

### Testing Outcome

All manual CRUD tests completed successfully.

The testing confirmed that:

* Express routes communicate successfully with MySQL
* Products can be created and stored persistently
* Existing products can be retrieved
* Products can be updated
* Products can be deleted
* Missing products return an appropriate `404` response
* Database errors are handled with a `500` response

## Security & Backend Best Practices

Although this is a learning project, several backend security and development best practices were applied.

### Environment Variables

Database credentials are stored in a local `.env` file instead of being written directly into the application source code.

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=fakestore
```

The `.env` file is excluded from Git using `.gitignore`.

This helps prevent sensitive database credentials from being accidentally committed to the repository.

### Parameterized SQL Queries

The API uses parameterized queries when values are supplied to SQL statements.

For example:

```js
db.query(
  'SELECT * FROM products WHERE id = ?',
  [id],
  callback
);
```

Using placeholders separates the SQL statement from the supplied values and helps protect against SQL injection.

### Database Connection Pool

The application uses a MySQL connection pool rather than creating a new database connection for every request.

The pool is configured in `db.js` and shared by the API routes.

This provides a cleaner and more efficient way to manage database connections.

### HTTP Status Codes

The API uses appropriate HTTP status codes to communicate the result of requests.

| Status Code | Meaning               | Example                   |
| ----------- | --------------------- | ------------------------- |
| `200`       | Request successful    | GET, PUT, DELETE          |
| `201`       | Resource created      | POST                      |
| `404`       | Resource not found    | Product ID does not exist |
| `500`       | Server/database error | MySQL query failure       |

### Error Handling

Database errors are handled by checking the error returned from MySQL.

The API logs the database error on the server while returning a simpler error response to the client.

For example:

```json
{
  "error": "Database error"
}
```

This prevents internal database error details from being unnecessarily exposed to the API client.

### Git Protection

The `.gitignore` file prevents files such as `.env` and `node_modules` from being committed to the repository.

This keeps sensitive configuration and unnecessary generated files out of version control.

### Key Practices Used

This project demonstrates several important backend practices:

* Keep secrets outside source code
* Use `.gitignore` to protect local configuration
* Use parameterized SQL queries
* Use a database connection pool
* Validate database errors
* Return appropriate HTTP status codes
* Keep database configuration separate from API route logic
* Use Git and GitHub to track and back up source code

| Section                       | Status |
| ----------------------------- | ------ |
| 1. Project Title & Goals      | 🟢     |
| 2. Technologies Used          | 🟢     |
| 3. Project Structure          | 🟢     |
| 4. Database Setup             | 🟢     |
| 5. API Endpoints              | 🟢     |
| 6. Running the API            | 🟢     |
| 7. MySQL Migration & Learning | 🟢     |
| 8. Testing & Results          | 🟢     |
| 9. Security & Best Practices  | 🟢     |

## Future Improvements

The current project successfully demonstrates a MySQL-backed RESTful CRUD API.

The following improvements could be added in future versions to extend the project and introduce additional backend development concepts.

### Input Validation

Add validation for incoming product data to ensure:

* `title` is provided and contains valid text
* `price` is provided
* `price` is a valid positive number
* Invalid requests return an appropriate `400 Bad Request` response

### Async/Await

The current database queries use callback functions.

The application could be refactored to use `async/await` with the promise-based MySQL API.

This would make the asynchronous code easier to read and maintain as the project grows.

### Automated Testing

Add automated tests using tools such as Jest and Supertest.

Automated tests could verify:

* GET requests
* POST requests
* PUT requests
* DELETE requests
* Error handling
* Database-related behaviour

This would reduce the need for manual testing and make future changes safer.

### Centralized Error Handling

A dedicated Express error-handling middleware could be introduced.

This would provide a consistent approach to handling errors across all API routes.

### API Documentation

The API could be documented using **OpenAPI / Swagger**.

This would provide an interactive description of the available endpoints, request formats, responses, and status codes.

### Additional Product Features

Future versions could introduce features such as:

* Product categories
* Product descriptions
* Product images
* Search and filtering
* Pagination
* Sorting
* More advanced database queries

### Authentication and Authorization

User authentication could be added in a future version.

This could introduce concepts such as:

* User accounts
* Login and registration
* Password hashing
* Authentication tokens
* Protected API routes
* Authorization

### Production Deployment

The API could eventually be deployed to a cloud hosting environment with a managed MySQL database.

This would provide additional experience with:

* Environment configuration
* Production databases
* Cloud deployment
* Application monitoring
* Security configuration

### Future Development Goal

The main goal of future improvements would be to evolve this learning project from a basic CRUD API into a more complete production-style backend application.
