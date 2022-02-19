const { GraphQLScalarType } = require('graphql')


const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: "valid date time value",
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast
})

module.exports = DateTime