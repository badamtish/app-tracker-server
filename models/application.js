const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    date: Date,
    jobTitle: String,
    company: String,
    url: String,
    statusId: String,
    userId: String,
    comments: String
});

module.exports = mongoose.model('Application', applicationSchema);

