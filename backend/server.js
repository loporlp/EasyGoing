const express = require('express');
const app = express();
const port = 3000;

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/serverstatus', (req, res) => {
  res.json({ message: 'Server is Running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
