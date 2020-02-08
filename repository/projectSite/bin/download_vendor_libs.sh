#!/bin/bash
set -ex

cd ..
mkdir static || true
mkdir static/js || true
mkdir static/css || true
mkdir static/aws-sdks || true

curl -s https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/v1.16.0/dist/amazon-cognito-identity.min.js -o static/aws-sdks/amazon-cognito-identity.v1.16.0.min.js
curl -s https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/v1.16.0/dist/aws-cognito-sdk.min.js -o static/aws-sdks/amazon-cognito-sdk.v1.16.0.min.js
curl -s https://raw.githubusercontent.com/aws/aws-sdk-js/v2.36.0/dist/aws-sdk.min.js -o static/aws-sdks/aws-sdk.v2.36.0.min.js
curl -s https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.min.js -o static/js/lodash-4.17.4.min.js
curl -s https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js -o static/js/jquery-1.12.4.min.js
curl -s https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js -o static/js/bootstrap-3.3.7.min.js
curl -s https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css -o static/css/bootstrap-3.3.7.min.css
curl -s https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css -o static/css/bootstrap-theme-3.3.7.min.css
