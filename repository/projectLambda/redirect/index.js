'use strict';

const AWS = require('aws-sdk')
const tableName = `${process.env.SLS_STAGE}-shortened-urls`
const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    const slug = event.pathParameters.slug;

    // Let's go to DynamoDB to retrieve the slug key.
    docClient.get({
       TableName: tableName,
       Key: {
         slug: slug
       }
     }, (err, data) => {
       console.log(data)
       if (err) {
         console.log(err);
         callback(err);
       }
       if (data.Item) {
         callback(
           null,
           {
             statusCode: 302,
             body: data.Item.long_url,
             headers: {
               'Location': data.Item.long_url,
               'Content-Type': 'text/plain'
             }
           }
         )
       } else {
         callback(
           null,
           {
             statusCode: 404,
             body: "This shortened link doesn't exist, check that you entered it right.",
             headers: {
               'Content-Type': 'text/plain'
             }
           }
         )
       }
     })


    /*
    This previously was only using the variable and returning the redirect
    const target = process.env['URL_' + slug.toUpperCase()] || 'https://serverless.com/framework/docs/';
    callback(
        null,
        {
            statusCode: 302,
            body: target,
            headers: {
                'Location': target,
                'Content-Type': 'text/plain',
            },
        }
    );
    */
}
