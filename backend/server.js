import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Now you can replace your hardcoded password with the variable
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json('hello this is backend');
});

app.get('/books', (req, res) => {
  const q = 'SELECT * FROM test.books';
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  // Use backticks around `desc` because it is a reserved word in MySQL
  const q = "INSERT INTO books (`title`, `desc`, `cover`, `price`) VALUES (?, ?, ?, ?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.cover, // Position 3 must match 'cover' column
    req.body.price, // Position 4 must match 'price' column
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.status(200).json("Book has been created successfully.");
  });
});

app.delete('/books/:id', (req, res) => {
  const bookID = req.params.id;
  const q = 'DELETE FROM books WHERE id =?';

  db.query(q, [bookID], (err, data) => {
    return res.json('book has been DELETED successfully');
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id; // Get ID from the URL
  
  // Complete the query string with the WHERE clause
  const q = "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ?, `price` = ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.cover,
    req.body.price,
    bookId
  ];

  // Pass the values array AND the bookId for the final '?'
  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Book has been updated successfully.");
  });
});

app.listen(8800, () => {
  console.log('connected to backend!!!');
});
