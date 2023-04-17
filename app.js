const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const session = require('express-session');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const addCostItemRouter = require('./routes/add_cost_item');
const costsReportRouter = require('./routes/costs_report');


/* ######################################################################################################## */
/* ## create a connection to Mongo. ####################################################################### */
/* ######################################################################################################## */

const atlas = dotenv.parsed.ATLASS
mongoose.connect(atlas);


/* ######################################################################################################## */
/* ## set up new random value for a 'secret'. ############################################################# */
/* ######################################################################################################## */

const baseRandom = Math.random();
const lowerLimit = 10000;
const upperLimit = 19999;
const rangedRandom =
    Math.floor
        (
            (baseRandom * (+upperLimit - +lowerLimit + 1)) + +lowerLimit
        );

const app = express();


/* ######################################################################################################## */
/* ## set up middlewares. ################################################################################# */
/* ######################################################################################################## */

app.use(session( // will allow me to force user to re-login.
    {
        secret: dotenv.parsed.SECRET1 + rangedRandom + dotenv.parsed.SECRET2, // hide secrets within .env
        cookie: { maxAge: 60 * 2 * 1000 }, // Two minutes.
        saveUninitialized: true
    }));
app.use(express.json());


/* ######################################################################################################## */
/* ## set up routes. ###################################################################################### */
/* ######################################################################################################## */

app.use('/', indexRouter)
app.use('/register', registerRouter);
app.use('/costs_report', costsReportRouter);
app.use('/add_cost_item', addCostItemRouter);


/* ######################################################################################################## */
/* ## start up server. #################################################################################### */
/* ######################################################################################################## */

app.listen(dotenv.parsed.PORT, () => {
    console.log(`Server runing on: ${dotenv.parsed.PORT}`);
})

