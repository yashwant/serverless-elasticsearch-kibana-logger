const AWS = require('aws-sdk');
// AWS.config.apiVersions = {
//   es: '2015-01-01'
// };

exports.handler = async (event) => {
    console.info(`Received inout event object ${event}`);
    
    try {
        switch (event.RequestType) {
            case 'Create':
            case 'Update':
                var es = new AWS.ES();
                var params = {
                  DomainName: process.env.ES_DOMAIN_NAME,
                  CognitoOptions: {
                    Enabled: true,
                    IdentityPoolId: event.ResourceProperties.IdentityPoolId,
                    RoleArn: event.ResourceProperties.RoleArn,
                    UserPoolId: event.ResourceProperties.UserPoolId
                  }
                };
                await es.updateElasticsearchDomainConfig(params).promise();
                break;
            case 'Delete':
                break;
        }
        await sendCloudFormationResponse(event, 'SUCCESS');
        console.info(`updateElasticsearchDomainConfig Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`updateElasticsearchDomainConfig Error for request type ${event.RequestType}:`, error);
        await sendCloudFormationResponse(event, 'FAILED');
    }
}

async function sendCloudFormationResponse(event, responseStatus, responseData) {
    var params = {
        FunctionName: process.env.CFSendResponse,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            ResponseURL: event.ResponseURL,
            ResponseStatus: responseStatus,
            ResponseData: responseData
        })
    };
    
    var lambda = new AWS.Lambda();
    var response = await lambda.invoke(params).promise();
    
    if (response.FunctionError) {
        var responseError = JSON.parse(response.Payload);
        throw new Error(responseError.errorMessage);
    }
}