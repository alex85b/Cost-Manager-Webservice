/*
the specification document demands :
The database should be a MongoDB database (using the MongoDB Atlas service).
The data should be organized in collections that,
at the minimum,
include the users and the costs collections.
The ‘users’ collection should hold documents that (at the minimum)
include the following properties:
id,
first_name,
and last_name.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsersSchema = new Schema({

    // must have:
    _id: { type: String}, // <-- index.
    first_name: { type: String, required: true },
    last_name: { type: String, required: true }
});

const User = mongoose.model(
    'users',
    UsersSchema
);

module.exports = User;