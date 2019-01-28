const express = require('express');
const path = require('path');

const baseRouter = express.Router();

baseRouter.get('/', (req, res) => {
    res.render('index.ejs')
});

module.exports = baseRouter;
