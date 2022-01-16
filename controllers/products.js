// =========================================================
// ====================  DEPENDENCIES  =====================
// =========================================================
const express = require('express');
const productsRouter = express.Router();

// models
const Product  = require('../models/product');
const User = require('../models/user');


// =========================================================
// ====================  Middleware  =====================
// =========================================================
// Function for Authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect('/sessions/login');
    }
}


// =========================================================
// ====================  ROUTES  ===========================
// =========================================================
// All routes begin with '/products'

// INDEX
// this page can be viewed regardless of login status
productsRouter.get('/', (req,res)=>{
    res.locals.currentUser = req.session.currentUser;
    // Check if there is a query string indicating non-standard sorting
    if (req.query.sort) {
        if (req.query.sort === 'rev'){
             // Sort Results into Reverse Alphabetical Order
            Product.find({}).sort({name:-1}).exec((err, foundProducts)=>{
                res.render('index.ejs', {products: foundProducts, disabled: "rao"});
            });
     
        } else if (req.query.sort === 'price'){
            // Sort Results into Price: Low to High
            Product.find({}).sort({price:1}).exec((err, foundProducts)=>{
                res.render('index.ejs', {products: foundProducts, disabled: "plh"});
            });
        } else if (req.query.sort === 'price_rev'){
            // Sort Results into Price: High to Low
            Product.find({}).sort({price:-1}).exec((err, foundProducts)=>{
                res.render('index.ejs', {products: foundProducts, disabled: "phl"});
            });
        }
    } else {
        // Standard route to show products in alphabetical order
        Product.find({}).sort({name:1}).exec((err, foundProducts)=>{
            res.render('index.ejs', {products: foundProducts, disabled: "ao"});
        })
    }
});


// NEW
productsRouter.get('/new', isAuthenticated, (req,res)=>{
    res.locals.currentUser = req.session.currentUser;
    res.render('new.ejs');
});


// DELETE
productsRouter.delete('/:id', isAuthenticated, (req,res)=>{
    Product.findByIdAndDelete(req.params.id, (error, deletedProduct)=>{
        res.redirect('/products');
    });
});


// ADD TO CART
productsRouter.put('/:id/cart', isAuthenticated, (req, res) => {
    res.locals.currentUser = req.session.currentUser;
    Product.findById(req.params.id, (error, foundProduct) => {
        // Adjust quantity of Products available 
        foundProduct.qty -= 1;
        foundProduct.save();
        // Add Product to the appropriate User's Shopping Cart
        User.findById(req.session.currentUser._id, (err, foundUser) => {
            const cart = foundUser.shoppingCart;
            cart.push(req.params.id);
            foundUser.save();
            res.render('show.ejs', {product: foundProduct});
        });
    });
});


// UPDATE
productsRouter.put('/:id', isAuthenticated, (req,res)=>{
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        qty: Number(req.body.qty),
        img: req.body.img
    }
    Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true }, (error, updatedProd)=>{
        res.redirect(`/products/${req.params.id}`);
    });
});


// CREATE
productsRouter.post('/', isAuthenticated, (req,res)=>{
    const newProduct = {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        qty: Number(req.body.qty),
        img: req.body.img
    }
    Product.create(newProduct, (error, createdProduct)=>{
        res.redirect('/products');
    });
});


// EDIT
productsRouter.get('/:id/edit', isAuthenticated, (req,res)=>{
    res.locals.currentUser = req.session.currentUser;
    Product.findById(req.params.id, (error, foundProduct)=>{
        res.render('edit.ejs', { product: foundProduct});
    });
});


// SHOW
// this page can be viewed regardless of login status
productsRouter.get('/:id', (req, res)=>{
    res.locals.currentUser = req.session.currentUser;
    Product.findById(req.params.id, (error, foundProduct)=>{
        res.render('show.ejs', { product: foundProduct });
    });
});


// EXPORT ROUTER
module.exports = productsRouter;