const express = require('express');
const router = express.Router();
const User = require('../models/users');
const testInput = require('../shared/isEmptyInvalid');
const fs = require('fs');
const path = require('path');

router.get('', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'get to / works',
        services_on_this_route: {
            post: {
                input: { user_id: { length: 'up to 12 chars', type: 'only english letters and integers and _' } }
                , function: 'registered users get a window of 2 minutes to add cost-items or get cost-reports'
            },
        },
    });
});

router.post('', (req, res, next) => {
    const user_id = req.body.user_id;

    /* check if user has submitted a user id */
    //////////////////////////////////////////
    if (testInput(user_id, new RegExp('^[\\w]{1,12}$'))) {

        /* assigment requirement: use a promise object */
        ////////////////////////////////////////////////

        /* 1) find incoming user_id */
        /* 2) do things with the query result */
        ///////////////////////////////////////
        User.find({ '_id': user_id }).then(function (data) {
            if (data.length) {
                /* 2.1) query isn't empty, remember that user loged-in */
                /* 2.2) query isn't empty, remember user's id */
                ///////////////////////////////////////////////
                req.session.identified = true;
                req.session.user_id = user_id;
                res.status(200).json({ status: 'sucess', message: 'user found', reult: `hello ${data[0]._doc.first_name}` });
            } else {
                /* 2.3) query isn't empty, remember user's id */
                ///////////////////////////////////////////////
                res.status(404).json({ status: 'failure', message: 'user not found' }); // 404 - Not Found
            }
        }).catch(next);
    } else {
        /* user hasn't provided an id */
        ///////////////////////////////
        res.status(400).json({ status: 'failure', message: "provided user_id is invalid" }); // 400 - Bad Request
    }
});

module.exports = router;
