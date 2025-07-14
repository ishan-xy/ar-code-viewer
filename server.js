const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5511;

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Serve static files (if any)
app.use(express.static('public'));

// Handle all routes that match the pattern /_[parameter]
app.get('/:parameter', (req, res) => {
    res.send(htmlContent);
});

// Handle root route
app.get('/', (req, res) => {
    res.send(`
        <h1>AR Model Viewer</h1>
        <p>Visit /[model_id] to view a model</p>
        <p>Example: <a href="/_nshai95ye">/_nshai95ye</a></p>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT}/_nshai95ye to test`);
});