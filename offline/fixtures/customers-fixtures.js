"use strict";

const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

const MAX_ITEMS = 100;

const fixtureFile = path.normalize(
  path.join(__dirname, '../', 'migrations', 'customers-seed.json'))

const callback = err => {
  if (err) throw err;

  console.log(`Seed generated in "${fixtureFile}"`)
}

let customers = []

for (let i = 0; i < MAX_ITEMS; i++) {
  const name = faker.name.findName();
  const data = {
    id: faker.random.uuid(),
    birthYear: faker.date.between('1900-01-01', '2020-01-01'),
    name: name,
    email: name.replace(/[^A-Za-z0-9]+/, '_').toLowerCase() + '@gmail.com',
    active: true
  };

  customers.push(data);

  console.log(data);
}

fs.writeFile(fixtureFile, JSON.stringify(customers), 'utf8', callback);
