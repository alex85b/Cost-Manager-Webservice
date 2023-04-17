const express = require('express');
const router = express.Router();
const testInput = require('../shared/isInvalid');
const Cost = require('../models/costs');

router.get('', (req, res) => {
    if (req.session.identified) {
        res.status(200).json({
            status: 'success',
            message: 'get to /costs_report works',
            services_on_this_route: {
                post: {
                    input: {
                        year: { length: 'up to 4 digits', type: 'only numbers', meaning: 'integer value of a year' }
                        , month: { length: 'up to 2 digits', type: 'only numbers', meaning: 'integer value of a month' }
                    }
                    , function: 'returns a report for registered cost items'
                },
            },
        });
    }
    else {
        res.status(200).json({ status: 'failure', message: "un-identified user" })
    }
})

router.post('', (req, res) => {

    /* check if user's session is identified */
    //////////////////////////////////////////
    if (!req.session.identified) {
        res.status(403).json({ status: 'failure', message: "un-identified user" }); // 403 - Forbidden
    } else {

        /* basic validation before writing to the DB */
        //////////////////////////////////////////////
        const message = [];
        const newEntry = { user_id: req.session.user_id }; // lenght is 1.

        const yearValidation = testInput(req.body.year, new RegExp('^[2]\\d{3}$'));
        const monthValidation = testInput(req.body.month, new RegExp('^0?[1-9]$|^1[012]$'));

        if (yearValidation === -1) {
            message.push("year is invalid");
        } else if (yearValidation) {
            newEntry['year'] = req.body.year;
        }

        if (monthValidation === -1) {
            message.push("month is invalid");
        } else if (monthValidation) {
            newEntry['month'] = req.body.month;
        }

        /* check if invalid value found */
        /* check if no input at all */
        //////////////////////////////////////////////
        if (message.length) {
            res.status(400).json({ status: 'failure', message: message }); // 400 - Bad Request
        } else if (newEntry.length > 1) {
            res.status(400).json({ status: 'failure', message: 'both month and year are undefined' }); // 400 - Bad Request
        } else {

            /* at least month or year are valid, perform query */
            ////////////////////////////////////////////////////
            Cost.find(newEntry).then(function (queryResult) {

                /* query has result */
                /////////////////////
                if (queryResult.length) {

                    const result =
                    {
                        description: queryResult[0]._doc.description
                        , category: queryResult[0]._doc.category
                        , sum: queryResult[0]._doc.sum
                        , year: queryResult[0]._doc.year
                        , month: queryResult[0]._doc.month
                    }


                    console.log(`/costs_report: query result: ${queryResult[0]._doc}`);
                    res.status(200).json({ status: 'sucess', message: 'retrived a query', reult: result });

                    /* query has NO result */
                    ////////////////////////
                } else {
                    res.status(404).json({ status: 'failure', message: 'empty query' }); // 404 - Not Found
                }

                /* something went wrong during the query to mongo atlas. */
                //////////////////////////////////////////////////////////
            }).catch(function (error) {
                res.status(406).json({ status: 'failure', message: "an error occurred while registering new cost item" }); // 406 - Not Acceptable
                console.log(`while attempting to add new cost item to the collection, an error occurred: ${error}`);
            });
        }
    }
});

module.exports = router;