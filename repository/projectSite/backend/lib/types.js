'use strict'

const resolvers = require('./resolvers')
const G = require('graphql')

const comment = new G.GraphQLObjectType({
  name: 'Comment',
  fields: {
    commenter_id: {
      type: G.GraphQLString
    },
    article_id: {
      type: G.GraphQLString
    },
    posted_at: {
      type: G.GraphQLInt
    },
    body: {
      type: G.GraphQLString
    }
  }
})

const articleType = new G.GraphQLObjectType({
  name: 'Article',
  fields: {
    id: {
      type: G.GraphQLString
    },
    author_id: {
      type: G.GraphQLString
    },
    score: {
      type: G.GraphQLInt
    },
    posted_at: {
      type: G.GraphQLInt
    },
    title: {
      type: G.GraphQLString
    },
    link: {
      type: G.GraphQLString
    },
    comments: {
      type: new G.GraphQLList(comment),
    }
  }
})

const article = {
  type: articleType,
  args: {
    id: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveArticle
}

const articles = {
  type: new G.GraphQLList(articleType),
  args: {
    author_id: {
      type: G.GraphQLString
    },
    hours: {
      type: G.GraphQLInt
    }
  },
  resolve: resolvers.resolveArticles
}

module.exports = {
  Articles: articles,
  Article: article,
  ArticleType: articleType,
  CommentType: comment
}
