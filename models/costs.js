/*
the specification document demands :
The database should be a MongoDB database (using the MongoDB Atlas service).
The data should be organized in collections that,
at the minimum,
include the users and the costs collections.
The ‘costs’ collection should hold documents that (at the minimum),
include the following properties:
description,
category,
and sum.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CostsSchema = new Schema({

    // must have:
    description: { type: String, required: true },
    category: { type: String, required: true },
    sum: { type: Number, required: true },

    // needed for my solution:
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    user_id: { type: String, required: true, index: true } // <-- indexing by user for efficient search.
});

const Cost = mongoose.model(
    'costs',
    CostsSchema
);

module.exports = Cost;