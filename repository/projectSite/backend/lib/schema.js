'use strict'

const G = require('graphql')
const types = require('./types')

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

module.exports.Schema = new G.GraphQLSchema({
  query: rootQuery
})
