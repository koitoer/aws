'use strict';
const AWS = require('aws-sdk')
const querystring = require('querystring')
const path = require('path')
const crypto = require('crypto')

AWS.config.setPromisesDependency(Promise)

const tableName = `${process.env.SLS_STAGE}-maps-table`
const docClient = new AWS.DynamoDB.DocumentClient()


module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));

  var body = JSON.parse(JSON.parse(JSON.stringify(event.body)));
  const ip = body.ip || "IP";
  const country = body.country_code || "Country";
  const countryName = body.country_name || 'Name';
  const region = body.region_code || 'RegionCode';
  const regionName = body.region_name || 'RegionCode';
  const city = body.city || 'City';
  const zip = body.zip || 'Zip';
  const latitude = body.latitude || 'Latitude';
  const longitude = body.longitude || 'Longitude';

    return new Promise((resolve, reject) => {
      // grab some random bytes
      resolve(crypto.randomBytes(8)
                   .toString('base64')
                   // take out chars that mean something in URLs
                   .replace(/[=+/]/g, '')
                   // 4 chars gives us 14776336 options
                   .substring(0, 4)
    )}).then(slug => {
        return docClient.put({
            TableName: tableName,
            Item: {
              key: slug,
              time: new Date().getTime(),
              ip: ip,
              country : country,
              countryName: countryName,
              region : region,
              regionName : regionName,
              city: city,
              zip:zip,
              longitude: longitude,
              latitude: latitude
            }}).promise()
            .then(() => { return slug })
    }).then((slug) => {
      console.log('woo, succeeded!!!')
      return callback(
        null,
        {
          statusCode: 200
        })
   }).catch(error => {
     console.log('Oh no, hit an error! ' + error)
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
  })
}
