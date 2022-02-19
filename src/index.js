//import { ApolloServer } from 'apollo-server';
const {ApolloServer} = require('apollo-server')
const fs = require('fs')
const path = require('path')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]
 


const resolvers = {
    Query: {
        info: () => `Hacker news clone`,
        feed: () => links,
        link: (parent, args) => {
            return links.find(link => link.id === args.id)
        }
    },
    Mutation: {
        post: (parent, args) => {
            let idCount = links.length
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link)
            return link
        },
        updateLink: (parent, args) => {
            const newLink = links.find(link => link.id === args.id)
            newLink.url = args.url ? args.url : newLink.url
            newLink.description = args.description ? args.description : newLink.description 
            return newLink
        },
        deleteLink: (parent, args) => {
            links = links.filter(link => link.id !== args.id)
            return args
        }
    }
}

const server = new ApolloServer({typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'), resolvers})

server.listen().then(({url}) => 
    console.log(`Server is running on ${url}`)
)