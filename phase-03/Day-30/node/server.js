const express = require('express');
const cors = require('cors');
const path = require('path');

const contactRoutes = require('./routes/contact');

const app = express();
app.use(cors());

// Serve static site for simple testing
app.use('/', express.static(path.join(__dirname,'..')));

// API
app.use('/api', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
