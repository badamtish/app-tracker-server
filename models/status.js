const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    statusId: String,
    status: String
});

module.exports = mongoose.model('Status', statusSchema);

