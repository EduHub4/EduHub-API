const express = require('express');
const connectToDb = require('./config/connectToDb');
require('dotenv').config()

// Connection To Database
connectToDb()

// Init App
const app = express()

// Middleware 
app.use(express.json())

// Routes
app.use('/eduhub/auth', require('./routes/authRoute'))


// Running The Server
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))