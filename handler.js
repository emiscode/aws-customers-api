'use strict';

const customers = [
  { id: "1", name: "Emilio", birthYear: '1985-12-05' },
  { id: "2", name: "Scodeler", birthYear: '1988-01-19' }
]

module.exports.listCustomers = async (event) => {
  console.log(event);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        customers,
      },
      null,
      2
    ),
  };
};

module.exports.getCustomerById = async (event) => {
  console.log(event);

  const { id } = event["pathParameters"];
  const customerResponse = customers.find(customer => customer.id === id);

  return {
    statusCode: 200,
    body: JSON.stringify(customerResponse, null, 2),
  };
};
