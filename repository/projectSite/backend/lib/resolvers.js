'use strict'

const lo = require('lodash')
const ddb = require('./dynamo')

function resolveArticle (context, args) {
  console.log("In resolver for article type", context)
  console.log(args)
  console.log(fieldNodes)
  return ddb.ArticleDB.get({
    Key: {
      id: args.id
    }
  }).promise().then(data => {
    console.log('Got back data', data)
    return data.Item
  }).then(article => {
    return ddb.CommentDB.query({
      KeyConditionExpression: 'article_id = :id',
      ExpressionAttributeValues: { ':id': article.id },
      // reverse the sort so recent comments are first
      ScanIndexForward: false,
      Limit: 50
    }).promise().then(data => {
      console.log("found comments", data)
      article.comments = data.Items
      console.log("Returning full info")
      console.log(article)
      return article
    })
  })
}

function resolveArticles (context, args) {
  console.log("In resolver for articles type", context)
  console.log(args)
  if (args.hours && args.author_id) {
    const t = (lo.now() / 1000) - (args.hours * 3600)
    const params = {
      IndexName: 'author_x_posted',
      KeyConditionExpression: 'author_id = :a_id and posted_at >= :earliest',
      ExpressionAttributeValues: {
        ':a_id': args.author_id,
        ':earliest': Math.round(t)
      }
    }
    console.log(params)
    return ddb.ArticleDB.query(params).promise().then(data => {
      console.log('Got back data', data)
      return data.Items
    })
  } else if (args.author_id) {
    console.log('Whoo!')
    return ddb.ArticleDB.query({
      IndexName: 'author_x_posted',
      KeyConditionExpression: 'author_id = :a',
      ExpressionAttributeValues: {
        ':a': args.author_id
      }
    }).promise().then(data => {
      console.log('Got back data', data)
      return data.Items
    })
  } else {
    return ddb.ArticleDB.scan({
    }).promise().then(data => {
      console.log('Got back data', data)
      return lo.sortBy(data.Items, [o => { return o.score || 0 }])
    })
  }
}


module.exports = {
  resolveArticles: resolveArticles,
  resolveArticle: resolveArticle,
}
