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

const CommentInputType = new G.GraphQLInputObjectType({
  name: 'NewComment',
  fields: {
    article_id: {
      type: G.GraphQLString
    },
    body: {
      type: G.GraphQLString
    }
  }
})

const mutations = new G.GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createComment: {
      type: types.CommentType,
      args: {
        comment: { type: CommentInputType }
      },
      resolve: (context, args) => {
        const new_comment = {
          article_id: args.comment.article_id,
          commenter_id: context.claims['cognito:username'],
          commenter_fullname: context.claims['name'],
          body: args.comment.body,
          posted_at: (lo.now() / 1000)
        }
        console.log('Creating comment DDB object', new_comment)
        return ddb.CommentDB.put({
          Item: new_comment
        }).promise().then(data => {
          console.log('Successfully wrote to DynamoDB', data)
          return new_comment
        })
      }
    },
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
