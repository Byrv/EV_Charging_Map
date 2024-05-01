const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Require the cors package
const appRoutes = require('./routes/approutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use('/api', appRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
