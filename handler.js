'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const params = { TableName: 'CUSTOMERS' }

const dynamodbOfflineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
}

const isOffline = () => false; //process.env.IS_OFFLINE;

const dynamoDB = isOffline()
  ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
  : new AWS.DynamoDB.DocumentClient()

module.exports.listCustomers = async (event) => {
  console.log(event);

  try {
    const queryString = {
      limit: 2,
      ...event.queryStringParameters
    };

    const { limit, next } = queryString;

    let paginationParams = {
      ...params,
      Limit: limit
    }

    if (next) {
      paginationParams.ExclusiveStartKey = {
        id: next
      }
    }

    let data = await dynamoDB.scan(paginationParams).promise();

    let nextToken = data.LastEvaluatedKey !== undefined
      ? data.LastEvaluatedKey.id
      : null

    const result = {
      items: data.Items,
      next_token: nextToken
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    console.log('Error', error);

    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      body: JSON.stringify({
        error: error.name ? error.name : 'Exception',
        message: error.message ? error.message : 'Generic error'
      })
    }
  }
};

module.exports.getCustomerById = async (event) => {
  console.log(event);

  try {
    const { id } = event["pathParameters"];

    const data = await dynamoDB
    .get({
      ...params,
      Key: {
        id: id
      }
    })
    .promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `customer with id ${id} not found` }, null, 2),
      };
    }

    const customerResponse = data.Item;

    return {
      statusCode: 200,
      body: JSON.stringify(customerResponse, null, 2),
    };

  } catch (error) {
    console.log('Error', error);

    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      body: JSON.stringify({
        error: error.name ? error.name : 'Exception',
        message: error.message ? error.message : 'Generic error'
      })
    }
  }
};

module.exports.saveCustomer = async (event) => {
  console.log(event);

  try {
    let data = JSON.parse(event.body);
    const timestamp = Date.now();
    const { name, birthYear, email } = data;

    const customer = {
      id: uuidv4(undefined, undefined, undefined),
      name,
      birthYear,
      email,
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    await dynamoDB
    .put({
      ...params,
      Item: customer,
    })
    .promise();

    return {
      statusCode: 201,
    };

  } catch (error) {
    console.log('Error', error);

    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      body: JSON.stringify({
        error: error.name ? error.name : 'Exception',
        message: error.message ? error.message : 'Generic error'
      })
    }
  }
};

module.exports.updateCustomer = async (event) => {
  console.log(event);

  const { id } = event["pathParameters"];

  try {
    let data = JSON.parse(event.body);

    const timestamp = Date.now();
    const { name, birthYear, email } = data;

    await dynamoDB
    .update({
      ...params,
      Key: {
        id
      },
      UpdateExpression:
        'SET #name = :name, birthYear = :by, email = :email, updatedAt = :updatedAt',
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':by': birthYear,
        ':email': email,
        ':updatedAt': timestamp
      }
    })
    .promise();

    return {
      statusCode: 204,
    };

  } catch (error) {
    console.log('Error', error);

    let errorName = error.name ? error.name : 'Exception';
    let errorMessage = error.message ? error.message : 'Generic error';
    let errorStatusCode = error.statusCode ? error.statusCode : 500

    if (errorName === 'ConditionalCheckFailedException') {
      errorName = `Customer with id ${id} not found`;
      errorMessage = `Nothing to be updated`;
      errorStatusCode = 404;
    }

    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({
        error: errorName,
        message: errorMessage
      })
    }
  }
};

module.exports.deleteCustomer = async (event) => {
  console.log(event);

  const { id } = event["pathParameters"];

  try {

    await dynamoDB
    .delete({
      ...params,
      Key: {
        id
      },
      ConditionExpression: 'attribute_exists(id)',
    })
    .promise();

    return {
      statusCode: 204,
    };

  } catch (error) {
    console.log('Error', error);

    let errorName = error.name ? error.name : 'Exception';
    let errorMessage = error.message ? error.message : 'Generic error';
    let errorStatusCode = error.statusCode ? error.statusCode : 500

    if (errorName === 'ConditionalCheckFailedException') {
      errorName = `Customer with id ${id} not found`;
      errorMessage = `Nothing to be deleted`;
      errorStatusCode = 404;
    }

    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({
        error: errorName,
        message: errorMessage
      })
    }
  }
};
