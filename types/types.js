const graphql = require('graphql');
const Application = require('../models/application');
const ApplicationStateType = require('../enums/ApplicationStateEnum');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} = graphql;

var GraphQLDate = require('graphql-date')

const ApplicationType = new GraphQLObjectType({
    name: 'Application',
    fields: () => ({
        id: { type: GraphQLID },
        date: { type: GraphQLDate },
        jobTitle: { type: GraphQLString },
        company: { type: GraphQLString },
        url: { type: GraphQLString },
        status: { type: ApplicationStateType },
        userId: { type: GraphQLString },
        comments: { type: GraphQLString }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        externalId: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        applications: {
            type: new GraphQLList(ApplicationType),
            resolve(parent, args) {
                return Application.find({ userId: parent.userId });
            }
        }
    })
});

const JobPostingType = new GraphQLObjectType({
    name: 'JobPosting',
    fields: () => ({
        postingDate: { type: GraphQLDate },
        jobTitle: { type: GraphQLString },
        company: { type: GraphQLString },
        url: { type: GraphQLString }

    })
});

module.exports = {
    User: UserType,
    Application: ApplicationType,
    JobPosting: JobPostingType
}
