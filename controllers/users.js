// ==========================================================================
// ========================  DEPENDENCIES  ==================================
// ==========================================================================
const bcrypt = require('bcrypt');
const express = require('express');
const usersRouter = express.Router();
const Product = require('../models/product');
const User = require('../models/user');


// =========================================================================
// ============================  ROUTES  ===================================
// =========================================================================
// REGISTER (New User)
usersRouter.get('/register', (req,res)=>{
    res.render('users/register.ejs', {currentUser: req.session.currentUser});
});


// REGISTER (Create User)
usersRouter.post('/', (req, res)=>{
    User.find({email: req.body.email}, (err, foundUser)=>{
        console.log(foundUser);
        if(foundUser.length === 1){
            console.log('already taken')
           res.render('users/register.ejs', {currentUser: req.session.currentUser});
        } else {
            if (req.body.password && req.body.password === req.body.password2) {
                console.log('passwords match')
                const newUser = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    hashedPassword: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                    }
                User.create(newUser, (err, createdUser)=>{
                    req.session.currentUser = createdUser;
                    console.log('user created and logged in')
                    res.redirect('/products');
                });
            } else {
                console.log('passwords must match!')
                res.render('users/register.ejs', { currentUser: req.session.currentUser });
            }
        }
    });
});     

// USER SHOW PAGE ***SHOPPING CART***
usersRouter.get('/:id', (req,res)=>{
    // Search for User by ID
    User.findById(req.params.id)
    .populate('shoppingCart')
    .exec((err, user)=>{
        res.locals.currentUser = req.session.currentUser;

        // The User Model stores Products in the shopping cart
        // Here we loop through shopping cart to format this info for rendering the page
        // Mainly for the purpose of tallying all instances of a specific product into a Quantity field
        const cart = {}
        
        for (let i = 0; i < user.shoppingCart.length; i++){
            // if product already exists in cart object, increment its quantity
            if (Object.keys(cart).includes(user.shoppingCart[i].name)){
                cart[user.shoppingCart[i].name].quantity += 1;
            // if roduct does NOT exist in cart object, add product to the cart
            // cart object uses Product._id as keys, the values are objects with keys: _id, name, price, quantity
            } else {
                cart[user.shoppingCart[i].name] = {_id: user.shoppingCart[i]._id, name: user.shoppingCart[i].name, price: user.shoppingCart[i].price, quantity: 1}
            }
        };
        res.render('users/show.ejs', {user: user, cart: cart});
    });
});




module.exports = usersRouter;