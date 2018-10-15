const graphql = require('graphql');
const User = require('../models/user');
const Application = require('../models/application');
const JobPosting = require('../models/job-posting');
const ApplicationStateType = require('../enums/ApplicationStateEnum');
const types = require('../types/types');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
} = graphql;
const GraphQLDate = require('graphql-date')

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        application: {
            type: types.Application,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Application.findById(args.id);
            }
        },
        user: {
            type: types.User,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        applications: {
            type: new GraphQLList(types.Application),
            args: {
                userId: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Application.find({
                    userId: args.userId
                }).sort({
                    date: 'descending'
                });
            }
        },
        jobPostings: {
            type: new GraphQLList(types.JobPosting),
            args: {},
            resolve(parent, args) {
                return JobPosting.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addApplication: {
            type: types.Application,
            args: {
                date: { type: new GraphQLNonNull(GraphQLDate) },
                jobTitle: { type: new GraphQLNonNull(GraphQLString) },
                company: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: GraphQLString },
                status: { type: new GraphQLNonNull(ApplicationStateType) },
                userId: { type: new GraphQLNonNull(GraphQLString) },
                comments: { type: GraphQLString }
            },
            resolve(parent, args) {
                let application = new Application({
                    date: args.date,
                    jobTitle: args.jobTitle,
                    company: args.company,
                    url: args.url,
                    status: args.status,
                    userId: args.userId,
                    comments: args.comments
                });
                return application.save();
            }
        },
        addUser: {
            type: types.User,
            args: {
                externalId: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let user = new User({
                    externalId: args.externalId,
                    firstName: args.firstName,
                    lastName: args.lastName
                });
                return user.save();
            }
        },
        addJobPosting: {
            type: types.JobPosting,
            args: {
                postingDate: { type: new GraphQLNonNull(GraphQLDate) },
                jobTitle: { type: new GraphQLNonNull(GraphQLString) },
                company: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let jobPosting = new JobPosting({
                    postingDate: args.postingDate,
                    jobTitle: args.postingDate,
                    company: args.company,
                    url: args.url
                })
                return jobPosting.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});