// DEPENDENCIES
const express = require('express');
const app = express();
require('dotenv').config();
const methodOverride = require('method-override');
const session = require('express-session');

const Product = require('./models/product');

// Environment Variables
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;


// Database Connection
const mongoose = require('mongoose');

mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
});


// Database Connection Error/Success
// Define callback function for various events
const db = mongoose.connection;
db.on('error', (error)=>console.log(error.message + 'Is Mongo not working?'));
db.on('connected', ()=>console.log('MongoDB is connected'));
db.on('disconnected', ()=>console.log('MongoDB has been disconnected'));


// MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false
    })
);


// ==================================================
// ROUTES/CONTROLLERS
// ==================================================
// ROOT
app.get('/', (req,res)=>{
    res.locals.currentUser = req.session.currentUser;
    res.render('landing.ejs');
});

// PRODUCTS CONTROLLER
const productsController = require('./controllers/products');
app.use('/products', productsController);

// USERS CONTROLLER
const usersController = require('./controllers/users');
app.use('/users', usersController);

// SESSIONS CONTROLLER
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);


// ==================================================
//  SERVER INSTANCE
// ==================================================
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});