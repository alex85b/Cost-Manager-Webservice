const express = require('express');
const router = express.Router();
const Cost = require('../models/costs');
const testInput = require('../shared/isEmptyInvalid');

router.get('', (req, res) => {
    if (req.session.identified) {
        res.status(200).json({
            status: 'success',
            message: 'get to /add_cost_item works',
            services_on_this_route: {
                post: {
                    input: {
                        description: { length: 'up to 20 chars', type: 'only english letters and _', meaning: 'cost item description' }
                        , category: { length: 'up to 12 chars', type: 'only english letters and _', meaning: 'cost item category' }
                        , sum: { length: 'total: up to 12 digits, 2 precision points', type: 'only numbers and .', meaning: 'the sum of this cost item' }
                        , year: { length: 'up to 4 digits', type: 'only numbers', meaning: 'integer value of a year' }
                        , month: { length: 'up to 2 digits', type: 'only numbers', meaning: 'integer value of a month' }
                    }
                    , function: 'adds new cost items'
                },
            },
        });
    }
    else {
        res.status(200).json({ status: 'failure', message: "un-identified user" })
    }
});

router.post('', (req, res) => {

    /* check if user's session is identified */
    //////////////////////////////////////////
    if (!req.session.identified) {
        res.status(403).json({ status: 'failure', message: "un-identified user" }); // 403 - Forbidden
    } else {

        /* basic validation before writing to the DB */
        //////////////////////////////////////////////
        var failure = false;
        const message = [];

        if (!testInput(req.body.description, new RegExp('^[a-zA-Z_]{1,20}$'))) {
            failure = true;
            message.push("description is invalid");
        }

        if (!testInput(req.body.category, new RegExp('^[a-zA-Z_]{1,12}$'))) {
            failure = true;
            message.push("category is invalid");
        }

        if (!testInput(req.body.sum, new RegExp('^\\d{1,12}$|^\\d{1,10}\\.\\d{2}$|^\\d{1,11}\\.\\d{1}$'))) {
            failure = true;
            message.push("sum is invalid");
        }

        if (!testInput(req.body.year, new RegExp('^[2]\\d{3}$'))) {
            failure = true;
            message.push("year is invalid");
        }

        if (!testInput(req.body.month, new RegExp('^0?[1-9]$|^1[012]$'))) {
            failure = true;
            message.push("month is invalid");
        }

        if (failure) {
            res.status(400).json({ status: 'failure', message: message }); // 400 - Bad Request
        } else {

            /* input is valid *//////////////////////
            /* create an object to write to atlas */
            ///////////////////////////////////////
            const newEntry =
            {
                description: req.body.description
                , category: req.body.category
                , sum: req.body.sum
                , year: req.body.year
                , month: req.body.month
                , user_id: req.session.user_id // <-- this is one of two indexes.
            };

            /* write new entry *////////////
            /* then on success do things */
            /* or catch if fails *////////
            /////////////////////////////
            Cost.create(newEntry).then(function (value) {
                console.log(`/add_cost_item: successfully added ${value} to Costs collection!`);
                res.status(200).json({ status: 'sucess', message: 'added a new cost item to Costs collection', reult: `added: ${value.description}` });

                /* something went wrong during writing to mongo atlas. */
                ////////////////////////////////////////////////////////
            }).catch(function (error) {
                res.status(406).json({ status: 'failure', message: "an error occurred while registering new cost item" }); // 406 - Not Acceptable
                console.log(`while attempting to add new cost item to the collection, an error occurred: ${error}`);
            });
        }
    }
})

module.exports = router;