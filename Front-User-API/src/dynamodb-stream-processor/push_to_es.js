var uuid = require("uuid");
var AWS = require('aws-sdk');
var path = require('path');

/* == Globals == */
var esDomain = {
    region: process.env.elasticRegion,
    endpoint: process.env.elasticURL,
    index: process.env.ES_ASSIGNMENT_INDEX,
    doctype: 'json'
};

var endpoint = new AWS.Endpoint(esDomain.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');

exports.main = function(event, context) {
    console.log(JSON.stringify(event, null, '  '));
    event.Records.forEach(function(record) {
        // var jsonDoc = new Buffer(record.kinesis.data, 'base64');
        console.log("==========>Processing Record:");
        console.log(record);
        if(record.dynamodb!=undefined && record.dynamodb.NewImage!=undefined)
        {
            console.log("DynamoDB Record:");
            console.log(record.dynamodb.NewImage);

            var jsonDoc = JSON.stringify({
                "lat":record.dynamodb.NewImage["lat"]["N"],
                "long":record.dynamodb.NewImage["long"]["N"]
            });
            console.log("Posting New JSON Doc to ES!");
            console.log(jsonDoc);
            postToES(jsonDoc.toString(), context);
        }
        else{
            console.log("No NewImage Record!");
        }
    });
}


/*
 * Post the given document to Elasticsearch
 */
function postToES(doc, context) {
    console.log('In postToES');
    var req = new AWS.HttpRequest(endpoint);
    req.method = 'POST';
    req.path = path.join('/', esDomain.index, esDomain.doctype);
    req.region = esDomain.region;
    req.headers['presigned-expires'] = false;
    req.headers['Content-Type'] = 'application/json';
    req.headers['Host'] = endpoint.host;
    req.body = doc;
    var signer = new AWS.Signers.V4(req, 'es'); // es: service code
    signer.addAuthorization(creds, new Date());
    var send = new AWS.NodeHttpClient();
    console.log('In postToES 1');
    send.handleRequest(req, null, function(httpResp) {
        var respBody = '';
        httpResp.on('data', function(chunk) {
            respBody += chunk;
        });
        httpResp.on('end', function(chunk) {
            console.log('Response: ' + respBody);
            var parsedRespBody = JSON.parse(respBody);
            console.log('Response: ' + parsedRespBody.result);
            if(parsedRespBody.result != undefined && parsedRespBody.result === "created"){
                context.succeed('Lambda added document ' + doc);
            }
            else
            {
                context.fail('Lambda failed with error: ' + respBody);
            }
        });
    }, function(err) {
        console.log('Error: ' + err);
        context.fail('Lambda failed with error ' + err);
    });
}