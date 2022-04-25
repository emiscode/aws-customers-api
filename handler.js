'use strict';

const customers = [
  { id: "1", name: "Emilio", birthYear: '1985-12-05' },
  { id: "2", name: "Scodeler", birthYear: '1988-01-19' }
]

const AWS = require('aws-sdk');
const params = { TableName: 'CUSTOMERS' }
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.listCustomers = async (event) => {
  console.log(event);

  try {
    let data = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
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

  const { id } = event["pathParameters"];
  const customerResponse = customers.find(customer => customer.id === id);

  if (customerResponse) {
    return {
      statusCode: 200,
      body: JSON.stringify(customerResponse, null, 2),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: `customer with id ${id} not found` }, null, 2),
    };
  }
};
