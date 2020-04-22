
if (typeof(Lambda) === 'undefined'){
    var AWS = require('aws-sdk');
    var Lambda = new AWS.Lambda();
}


module.exports = {
    Lambda: Lambda
}