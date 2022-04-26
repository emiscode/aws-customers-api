# aws-customers-api
Customers REST API Project with AWS Lambda and Serverless Framework

- AWS Lambda
- AWS API Gateway
  - GET /customers
    - 200: returns the customers list
  - GET /customers/{id}
    - 200: returns the customer
    - 404: returns an error message
  - POST /customers
  - PUT /customers/{id}
  - DELETE /customers/{id}
- Serverless Framework
- Front-End > AWS API Gateway > AWS Lambda
- DynamoDB
- Some commands:
  - sls deploy
  - sls offline
  - sls dynamodb install
  - sls deploy -f getCustomerById
  - sls logs -f getCustomerById --tail
  - sls invoke local -f getCustomerById
  - sls offline start (to start with dynamodb locally)
  - aws dynamodb batch-write-item --request-items file://customers.json

