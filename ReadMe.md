# Pushing Data to ElasticSearch using serverless stack
This is a sample serverless app with 2 parts:
1) REST APIs for storing lat/long data to DynamoDB (Folder - Front-User-API)
2) and then Pushing that data to ElasticSearch (Folder - ElasticSearch-Kibana-Cognito)

### ElasticSearch-Kibana-Cognito
- ElasticSearch
- Kibana with Cognito Auth

### Front-User-API
- API to save lat/long data to DynamoDb Table
- Push data to elasticsearch via DynamoDB stream

## Steps to Deploy the code
- Deploy ElasticSearch Stack first
- Then Deploy DynamoDB and User APIs

### Clone the code
- Clone to your machine
```
$ git clone git@github.com:yashwant/serverless-elasticsearch-kibana-logger.git

```

### Setup Elasticsearch
- Install dependencies
```
$ cd serverless-elasticsearch-kibana-logger/ElasticSearch-Kibana-Cognito

$ npm install
```

- Rename aws_params.tp to aws_params.yml & change parameters accordingly 
```
$ mv aws_params.tp aws_params
```

- Deploy
```
$ serverless deploy
```

### Deploy front user API
- Install dependencies
```
$ cd ../Front-User-API

$ npm install
```

- Rename aws_params.tp to aws_params.yml & change parameters accordingly 
```
$ mv aws_params.tp aws_params
```

- Deploy
```
$ serverless deploy
```

### Test the Setup
You can use the REST API post method to post lat/long parameters.

POST method header
```
Content-Type: application/json
```

POST method sample body 
```
{
    "lat": 12.011,
    "long": 13.003
}
```


To check the data in Elasticsearch via Kibana dashboard, create a new user in cognito userpool and verify that user.

### Create new user
- Create new user
```
$ aws cognito-idp sign-up --region us-east-1 --client-id <client id> --username <email> --password <password>

```

- Confirm user
```
$ aws cognito-idp admin-confirm-sign-up --region us-east-1 --user-pool-id <pool id> --username <user email>

```

### Login to Kibana
- You can find Kibana dashboard URL via aws console Elasticsearch service.
- Login to kibana using credentials generated in above step. 


