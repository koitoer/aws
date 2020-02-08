'use strict'

const G = require('graphql')
const types = require('./types')
const mutators = require('./mutators')

const rootQuery = new G.GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ping: {
      type: G.GraphQLString,
      resolve () {
        return 'pong'
      }
    },
    articles: types.Articles,
    article: types.Article
  }
})
const privateSchema = new G.GraphQLSchema({
  mutation: mutators.Mutations,
  query: rootQuery
})

const publicSchema = new G.GraphQLSchema({
  query: rootQuery
})

module.exports = {
  Schema: privateSchema,
  PublicSchema: publicSchema
}
