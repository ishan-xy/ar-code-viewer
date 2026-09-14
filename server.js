require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5511;

const BASE_URL = (process.env.BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, '');

const htmlTemplate = fs.readFileSync(
  path.join(__dirname, 'index.html'),
  'utf8'
);

const htmlContent = htmlTemplate.replace(/%%BASE_URL%%/g, BASE_URL);

app.use(express.static('public'));

app.get('/:query', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(htmlContent);
});

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AR Viewer</title>
  <style>
    body {
      background: #070a0f;
      color: #8899bb;
      font-family: monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      flex-direction: column;
      gap: 12px;
    }

    a {
      color: #00d4ff;
    }
  </style>
</head>
<body>
  <p>AR Model Viewer — backend: <code>${BASE_URL}</code></p>
  <p>Visit <a href="/example-query">/&lt;query&gt;</a> to view a model.</p>
</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`AR viewer  : http://localhost:${PORT}`);
  console.log(`Backend URL: ${BASE_URL}`);
});