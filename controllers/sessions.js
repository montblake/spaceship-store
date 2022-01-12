const bcrypt = require('bcrypt');
const express = require('express');
const sessionsRouter = express.Router();
const User = require('../models/user');

sessionsRouter.get('/login', (req, res)=>{
    res.render('sessions/login.ejs', { currentUser: req.session.currentUser });
});

sessionsRouter.post('/', (req, res) => {
    User.findOne({ email: req.body.email}, (err, foundUser) => {
        if (err) {
            console.log(err)
            res.send('oops the db had a problem');
        } else if (!foundUser) {
            res.send(`<a href='/'>Sorry, no user found </a>`)
        } else {
            // user found by email, now check password
            if (bcrypt.compareSync(req.body.password, foundUser.hashedPassword)){
                req.session.currentUser = foundUser;
                res.redirect('/products')
            } else {
                res.send('<a href="/">Password does not match</a>');
            }
        }
    });
});


sessionsRouter.delete('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/products');
    });
});


module.exports = sessionsRouter;