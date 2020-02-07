'use strict'

const G = require('graphql')

const schema = new G.GraphQLSchema({
  query: new G.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ping: {
        type: G.GraphQLString,
        // {"ping": "pong"}
        resolve () {
          return 'pong'
        }
      }
    }
  })
})

function runQuery (query, claims, variables) {
  return G.graphql(schema, query, {claims: claims}, null, variables)
}

module.exports.handler = (event, context, cb) => {
  console.log('Received event', JSON.stringify(event))

  const userInfo = event.requestContext.authorizer.claims
  console.log(`Event from user ${userInfo.name} with ID ${userInfo.sub}`)

  const request = JSON.parse(event.body)
  console.log('Query: ' + request.query)
  console.log('variables: ' + JSON.stringify(request.variables))

  return runQuery(request.query, userInfo, request.variables)
    .then(response => {
      console.log(response)
      const respified = {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(response)
      }
      console.log('Built response')
      console.log(respified)
      return respified
    })
    .then(response => cb(null, response))
    .catch(err => cb(err))
}
