require('dotenv').config(); 
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
// mongoose.set('debug', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/api', accountRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
