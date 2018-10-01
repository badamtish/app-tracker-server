const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobPostSchema = new Schema({
    postingDate: Date,
    jobTitle: String,
    company: String,
    url: String,
});

module.exports = mongoose.model('JobPosting', jobPostSchema);

