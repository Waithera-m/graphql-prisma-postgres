//import { ApolloServer } from 'apollo-server';
const { ApolloServer, PubSub } = require('apollo-server')
const { PrismaClient } = require("@prisma/client")
const fs = require('fs')
const path = require('path')
const { getUserId } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const DateTime = require('./resolvers/DateTime')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const prisma = new PrismaClient()
const pubsub = new PubSub()

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    // console.log("request: ", req)
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});

server.listen().then(({url}) => 
    console.log(`Server is running on ${url}`)
)