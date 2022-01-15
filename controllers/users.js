const bcrypt = require('bcrypt');
const express = require('express');
const Product = require('../models/product');
const usersRouter = express.Router();
const User = require('../models/user');




usersRouter.get('/register', (req,res)=>{
   
    res.render('users/register.ejs', {currentUser: req.session.currentUser});
});


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


usersRouter.get('/:id', (req,res)=>{
    
    User.findById(req.params.id)
    .populate('shoppingCart')
    .exec((err, user)=>{
        res.locals.currentUser = req.session.currentUser;
        console.log(user.shoppingCart)

        const cart = {}
        
        for (let i = 0; i < user.shoppingCart.length; i++){
            console.log(Object.keys(cart));
            if (Object.keys(cart).includes(user.shoppingCart[i].name)){
                cart[user.shoppingCart[i].name].quantity += 1;

            } else {
                cart[user.shoppingCart[i].name] = {_id: user.shoppingCart[i]._id, name: user.shoppingCart[i].name, price: user.shoppingCart[i].price, quantity: 1}
            }
        };
        // res.send(cart)
        res.render('users/show.ejs', {user: user, cart: cart});
    });
});

usersRouter.get('/:id/edit', (req,res)=>{
    User.findById(req.params.id)
    .populate('shoppingCart')
    .exec((err, user)=>{
        res.locals.currentUser = req.session.currentUser;
        res.render('users/edit.ejs', {user: user});
    });
})


module.exports = usersRouter;