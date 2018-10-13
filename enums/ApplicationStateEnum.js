const { GraphQLEnumType } = require('graphql');

const ApplicationStateType = new GraphQLEnumType({
    name: 'ApplicationsStateEnum',
    values: {
        applied: {
            value: 0,
        },
        inreview: {
            value: 1,
        },
        inprocess: {
            value: 2,
        },
        rejected: {
            value: 3,
        },
        offer: {
            value: 4
        }
    },
});

module.exports = ApplicationStateType;

