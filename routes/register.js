const express = require('express');
const router = express.Router();
const User = require('../models/users');
const testInput = require('../shared/isEmptyInvalid');

router.get('', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'get to /register works',
        services_on_this_route: {
            post: {
                input: {
                    user_id: { length: 'up to 12 chars', type: 'only english letters and integers and _' }
                    , first_name: { length: 'up to 12 chars', type: 'only english letters' }
                    , last_name: { length: 'up to 12 chars', type: 'only english letters' }
                }
                , function: 'registers new user'
            },
        },
    });
})

router.post('', (req, res) => {

    /* basic validation before writing to the DB */
    //////////////////////////////////////////////
    var failure = false;
    const message = [];

    if (!testInput(req.body.user_id, new RegExp('^[\\w]{1,12}$'))) {
        failure = true;
        message.push("user_id is invalid");
    }

    if (!testInput(req.body.first_name, new RegExp('^[a-zA-Z]{1,12}$'))) {
        failure = true;
        message.push("first_name is invalid");
    }

    if (!testInput(req.body.last_name, new RegExp('^[a-zA-Z]{1,12}$'))) {
        failure = true;
        message.push("last_name is invalid");
    }

    if (failure) {
        res.status(400).json({ status: 'failure', message: message }); // 400 - Bad Request
    } else {
        /* input is valid */
        /* create an object to write to atlas */
        ///////////////////////////////////////
        const newEntry =
        {
            _id: req.body.user_id
            , first_name: req.body.first_name
            , last_name: req.body.last_name
        };

        /* write new entry */
        /* then on success do things */
        /* or catch if fails */
        //////////////////////
        User.create(newEntry).then(function (value) {
            console.log('/register: created new entry in Users: ', value);

            /* mark session as a 'identified' meaning that user is registered and known. */
            //////////////////////////////////////////////////////////////////////////////
            req.session.identified = true;

            /* remember user-id for this session, it will be used to execute report-queries. */
            //////////////////////////////////////////////////////////////////////////////////
            req.session.user_id = req.body.user_id;

            res.status(200).json({
                status: 'sucess'
                , message: 'registered new user'
                , reult: `hello ${value.first_name} ${value.last_name}`
            });

            /* something went wrong during writing to mongo atlas. */
            ////////////////////////////////////////////////////////
        }).catch(function (error) {
            res.status(406).json({ status: 'failure', message: "an error occurred while registering new user" }); // 406 - Not Acceptable
            console.log(`while attempting to add new user to the collection, an error occurred: ${error}`);
        });
    }
})

module.exports = router;