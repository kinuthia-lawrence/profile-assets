// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql');

// const app = express();
// const port = 3000;

// // Create a MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'your_mysql_user',
//   password: 'your_mysql_password',
//   database: 'your_database_name'
// });

// // Connect to MySQL
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL: ' + err.stack);
//     return;
//   }
//   console.log('Connected to MySQL as id ' + connection.threadId);
// });

// // Middleware to parse JSON in request body
// app.use(bodyParser.json());

// // API endpoint for booking
// app.post('/bookNow', (req, res) => {
//   const data = req.body;

//   // Perform MySQL insert operation here using the 'data' received
//   // Example: connection.query('INSERT INTO your_table_name SET ?', data, (error, results) => { });

//   // Send a response to the client (for testing purposes)
//   res.send('Booking successful!');
// });

// // API endpoint for reserving a table
// app.post('/reserveTable', (req, res) => {
//   const data = req.body;

//   // Perform MySQL insert operation here using the 'data' received
//   // Example: connection.query('INSERT INTO your_table_name SET ?', data, (error, results) => { });

//   // Send a response to the client (for testing purposes)
//   res.send('Table reservation successful!');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for the port or default to 3000

// Create MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust according to your needs
  host: 'localhost',
  user: process.env.MYSQL_USER || 'your_mysql_user', // Use environment variable or default value
  password: process.env.MYSQL_PASSWORD || 'your_mysql_password', // Use environment variable or default value
  database: process.env.MYSQL_DATABASE || 'your_database_name', // Use environment variable or default value
});

// Connect to MySQL (optional)
pool.getConnection((error, connection) => {
  if (error) {
    console.error('Error connecting to MySQL: ' + error.stack);
    process.exit(1);
  }
  console.log('Connected to MySQL as id ' + connection.threadId);

  // Release the connection back to the pool
  connection.release();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  pool.end((err) => {
    if (err) {
      console.error('Error closing the connection pool:', err.message);
    } else {
      console.log('Connection pool closed.');
    }
    process.exit(0);
  });
});

// Parse JSON request bodies
app.use(bodyParser.json());

// Endpoint for booking
app.post('/bookNow', (req, res) => {
  const data = req.body;

  // Insert booking data into MySQL using a parameterized query
  pool.query('INSERT INTO bookings SET ?', data, (error, results) => {
    if (error) {
      console.error('Error executing query:', error.sql);
      res.status(500).send('Error booking');
    } else {
      res.send('Booking successful!');
    }
  });
});

// Endpoint for reserving table
app.post('/reserveTable', (req, res) => {
  const data = req.body;

  // Insert reservation data into MySQL using a parameterized query
  pool.query('INSERT INTO reservations SET ?', data, (error, results) => {
    if (error) {
      console.error('Error executing query:', error.sql);
      res.status(500).send('Error reserving table');
    } else {
      res.send('Table reserved successfully!');
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
