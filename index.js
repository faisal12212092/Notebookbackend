var cors = require('cors');
const connectToMongo = require("./db");
connectToMongo();
const express = require("express");
const app = express();
const router = express.Router();//middleware
const port = 5000;

app.use(cors())

app.use(express.json()); 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Exmple app listening on port:http://127.0.0.1:${port}`);
});
