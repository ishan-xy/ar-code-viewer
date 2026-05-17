const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 5511;

// The Go backend URL. Override with the BASE_URL environment variable so the
// same Docker image / PM2 process can be pointed at any backend without
// rebuilding or editing files.
//   e.g.  BASE_URL=https://api.mysite.com node server.js
const BASE_URL = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

// Read the template once at startup and inject the backend URL.
// index.html uses the literal placeholder  %%BASE_URL%%  so there is no risk
// of accidentally replacing legitimate content.
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const htmlContent  = htmlTemplate.replace(/%%BASE_URL%%/g, BASE_URL);

app.use(express.static('public'));

// Every path that looks like  /<query>  serves the AR viewer.
// The viewer JS extracts the query from window.location.pathname.
app.get('/:query', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);
});

// Root — simple landing / health-check page.
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AR Viewer</title>
  <style>
    body { background:#070a0f; color:#8899bb; font-family:monospace;
           display:flex; align-items:center; justify-content:center;
           min-height:100vh; margin:0; flex-direction:column; gap:12px; }
    a { color:#00d4ff; }
  </style>
</head>
<body>
  <p>AR Model Viewer — backend: <code>${BASE_URL}</code></p>
  <p>Visit <a href="/example-query">/&lt;query&gt;</a> to view a model.</p>
</body>
</html>`);
});

app.listen(PORT, () => {
    console.log(`AR viewer  : http://localhost:${PORT}`);
    console.log(`Backend URL: ${BASE_URL}`);
});