const graphql = require('graphql');
const User = require('../models/user');
const Application = require('../models/application');
const JobPosting = require('../models/job-posting');
const ApplicationStateType = require('../enums/ApplicationStateEnum');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull } = graphql;

const ApplicationType = new GraphQLObjectType({
    name: 'Application',
    fields: () => ({
        id: { type: GraphQLID },
        date: { type: GraphQLString },
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

/* const StatusType = new GraphQLObjectType({
    name: 'ApplicationStatus',
    fields: () => ({
        id: { type: GraphQLID },
        statusId: { type: GraphQLString },
        status: { type: GraphQLString }
    })
});*/

const JobPostingType = new GraphQLObjectType({
    name: 'JobPosting',
    fields: () => ({
        postingDate: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
        company: { type: GraphQLString },
        url: { type: GraphQLString }

    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        application: {
            type: ApplicationType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Application.findById(args.id);
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        applications: {
            type: new GraphQLList(ApplicationType),
            args: { userId: { type: GraphQLID } },
            resolve(parent, args) {
                return Application.find({
                    userId: args.userId
                }).sort({
                    date: 'descending'
                });
            }
        },
        jobPostings: {
            type: new GraphQLList(JobPostingType),
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
            type: ApplicationType,
            args: {
                date: { type: new GraphQLNonNull(GraphQLString) },
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
            type: UserType,
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
        /* addStatus: {
            type: StatusType,
            args: {
                statusId: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let status = new Status({
                    statusId: args.statusId,
                    status: args.status
                });
                return status.save();
            }
        },*/
        addJobPosting: {
            type: JobPostingType,
            args: {
                postingDate: { type: new GraphQLNonNull(GraphQLString) },
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