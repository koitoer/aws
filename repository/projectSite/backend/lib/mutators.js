'use strict'

const G = require('graphql')
const uuid = require('uuid/v4')
const lo = require('lodash')
const types = require('./types')
const ddb = require('./dynamo')

const ArticleInputType = new G.GraphQLInputObjectType({
  name: 'NewArticle',
  fields: {
    link: {
      type: G.GraphQLString
    },
    title: {
      type: G.GraphQLString
    }
  }
})

const mutations = new G.GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createArticle: {
      type: types.ArticleType,
      args: {
        article: { type: ArticleInputType }
      },
      resolve: (context, args) => {
        console.log(context)
        console.log(args)

        const new_article = {
          author_id: context.claims['cognito:username'],
          author_fullname: context.claims['name'],
          id: uuid(),
          link: args.article.link,
          title: args.article.title,
          posted_at: (lo.now() / 1000)
        }
        console.log('Creating DDB object', new_article)
        return ddb.ArticleDB.put({
          Item: new_article,
          Expected: {
            id: {Exists: false}
          }
          // ReturnValues: 'NONE'
        }).promise().then(data => {
          console.log('Successfully wrote to DynamoDB', data)
          return new_article
        })
      }
    }
  }
})

module.exports = {
  Mutations: mutations
}
