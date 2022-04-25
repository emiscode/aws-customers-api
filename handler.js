'use strict';

const customers = [
  { id: 1, name: "Emilio", birthYear: '1985-12-05' },
  { id: 2, name: "Scodeler", birthYear: '1988-01-19' }
]

module.exports.listCustomers = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        customers,
        event
      },
      null,
      2
    ),
  };
};
