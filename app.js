const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

mongoose.connect('mongodb://apptrkr-test:apptrkr-test1@ds235431.mlab.com:35431/test-badamtish', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(4000, () => {
    console.log('Server listening on port 4000');
});

