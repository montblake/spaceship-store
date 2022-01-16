// File to Seed DB with info from productSeed.js
// Run in Terminal with command: "node seed_separate.js"


// DEPENDENCIES
const express = require('express');
const app = express();
require('dotenv').config();

const Product = require('./models/product');
const productSeed = require('./models/productSeed');

// Environment Variables
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Database Connection
const mongoose = require('mongoose');

mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error)=>console.log(error.message + 'Is Mongo not working?'));
db.on('connected', ()=>console.log('MongoDB is connected'));
db.on('disconnected', ()=>console.log('MongoDB has been disconnected'));


// First, Delete All Documents in Collection
Product.deleteMany({}, (err, deletedProducts)=>{
    // Create New Documents from productSeed and save to DB
    Product.create(productSeed, (err, seededProducts)=>{
        if (err) {
            console.log(err);
        } else {
          console.log(seededProducts);
        }
    });
});
