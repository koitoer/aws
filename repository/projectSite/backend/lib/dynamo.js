'use strict'

const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)

const articles = new AWS.DynamoDB.DocumentClient({
  params: {TableName: process.env.ARTICLES_TABLE}
})
const comments = new AWS.DynamoDB.DocumentClient({
  params: {TableName: process.env.COMMENTS_TABLE}
})

module.exports = {
  ArticleDB: articles,
  CommentDB: comments,
}
