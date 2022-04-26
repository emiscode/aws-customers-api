'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const params = { TableName: 'CUSTOMERS' }
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.listCustomers = async (event) => {
  console.log(event);

  try {
    let data = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
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
