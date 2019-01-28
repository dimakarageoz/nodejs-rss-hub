const express = require('express');

const userService = require('../schema/user/userService');

const router = express.Router();

router.get(/(login|sign-up)/, (req, res, next) => {
    if (!!req.session && !!req.session.userInfo) {
        res.redirect('/');
    } else {
        next();
    }
});

router.get('/login', (req, res) => {
    let obj = {
        success: null,
        error: null
    };

    if (req.session && req.session.appRegisterMessage) {
        obj = {
            success: req.session.appRegisterMessage.message,
            error: null
        };

        req.session.appRegisterMessage = null;
    }

    res.render('login.ejs', obj);
});

router.post('/login', (req, res) => {
    userService
        .login(req.body)
        .then((user) => {
            req.session.userInfo = {
                email: user.email,
                _id: user._id
            };

            res.redirect('/');
        })
        .catch((err, errorStatus) => {
            res.render('login.ejs', {error: err, success: null})
        })
    ;
});

router.get('/sign-up', (req, res) => {
    res.render('sign-up.ejs', {error: null})
});

router.post('/sign-up', (req, res) => {
    userService
        .create(req.body)
        .then((user) => {
            req.session.appRegisterMessage = {
                type: 'success',
                message: 'User was successfully created, please login with your credentials'
            };

            res.redirect('/login');
        })
        .catch((err, errorStatus) => {
            res.render('sign-up.ejs', {error: err})
        })
    ;
});

router.get('/logout', (req, res) => {
    req.session.userInfo = null;

    res.redirect('/login');
});

module.exports = router;
