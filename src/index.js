//import { ApolloServer } from 'apollo-server';
const {ApolloServer} = require('apollo-server')
const { GraphQLScalarType } = require('graphql')
const { PrismaClient } = require("@prisma/client")
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]
 


const resolvers = {
    Query: {
        info: () => `Hacker news clone`,
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        link: async (parent, args, context) => {
            return context.prisma.link.findUnique({where: {id: args.id}})
        }
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                    createdAt: new Date()
                }
            })
            return newLink
        },
        updateLink: async (parent, args, context) => {
            const updatedLink = context.prisma.link.update({
                where: {id: args.id},
                data: {
                    url: args.url,
                    description: args.description
                }
            });
            // const updatedLink = context.prisma.link.findUnique({where: {id: args.id}})
            return updatedLink
        },
        deleteLink: async (parent, args, context) => {
            const deletedLink = context.prisma.link.delete({
                where: {
                    id: args.id
                }
            })
            return deletedLink
        }
    },

    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: "valid date time value",
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString(),
        parseLiteral: ast => ast
    })
}

const server = new ApolloServer({typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'), resolvers, context: {prisma}})

server.listen().then(({url}) => 
    console.log(`Server is running on ${url}`)
)