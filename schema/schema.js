const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList } = graphql;

var applications = [
    { id: '1', date: '28/09/2018', jobTitle: 'Full Stack Developer', company: 'Google', url: 'https://www.google.com', statusId: '1', userId: '2', public: false, comments: '' },
    { id: '2', date: '29/09/2018', jobTitle: 'Full Stack Engineer', company: 'Google', url: 'https://www.google.com', statusId: '1', userId: '2', public: true, comments: '' },
    { id: '3', date: '30/09/2018', jobTitle: 'Software Engineer', company: 'Google', url: 'https://www.google.com', statusId: '1', userId: '1', public: false, comments: '' },
    { id: '4', date: '01/09/2018', jobTitle: 'Associate', company: 'Google', url: 'https://www.google.com', statusId: '1', userId: '2', public: true, comments: '' },
    { id: '5', date: '02/09/2018', jobTitle: 'Intern', company: 'Google', url: 'https://www.google.com', statusId: '1', userId: '1', public: false, comments: '' },
]

var users = [
    { id: '1', firstName: 'Nischal', lastName: 'Kumar' },
    { id: '2', firstName: 'Sumith', lastName: 'Kumar' }
]

const ApplicationType = new GraphQLObjectType({
    name: 'Application',
    fields: () => ({
        id: { type: GraphQLID },
        date: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
        company: { type: GraphQLString },
        url: { type: GraphQLString },
        statusId: { type: GraphQLString },
        userId: { type: GraphQLString },
        public: { type: GraphQLBoolean },
        comments: { type: GraphQLString }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        applications: {
            type: new GraphQLList(ApplicationType),
            resolve(parent, args) {
                return _.filter(applications, { userId: parent.id });
            }
        }
    })
});

const StatusType = new GraphQLObjectType({
    name: 'ApplicationStatus',
    fields: () => ({
        id: { type: GraphQLID },
        status: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        application: {
            type: ApplicationType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(applications, { id: args.id });
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(users, { id: args.id });
            }
        },
        // This query should fetch from a separate collection which contains only job title, company and url of the job and not private applications
        publicApplications: {
            type: new GraphQLList(ApplicationType),
            args: {},
            resolve(parent, args) {
                //return publicApplications
                return _.filter(applications, { public: true });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});