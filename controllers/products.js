const express = require('express');
const { append } = require('express/lib/response');
const productsRouter = express.Router();

const Product  = require('../models/product');
const productSeed = require('../models/productSeed');

const User = require('../models/user');


// Auth Middleware
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
// INDEX
productsRouter.get('/', (req,res)=>{
    res.locals.currentUser = req.session.currentUser
    Product.find({}, (err, foundProducts)=>{
        
        res.render('index.ejs', {products: foundProducts});
    });
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


// ADD TO CART / BUY
productsRouter.put('/:id/buy', isAuthenticated, (req, res) => {
    res.locals.currentUser = req.session.currentUser;
    Product.findById(req.params.id, (error, foundProduct) => {
        console.log(foundProduct);
        foundProduct.qty -= 1;
        foundProduct.save();
        User.findById(req.session.currentUser._id, (err, foundUser) => {
            foundUser.shoppingCart.push(foundProduct._id);
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
productsRouter.get('/:id', (req, res)=>{
    res.locals.currentUser = req.session.currentUser;
    Product.findById(req.params.id, (error, foundProduct)=>{
        res.render('show.ejs', { product: foundProduct });
    });
});


// EXPORT ROUTER
module.exports = productsRouter;