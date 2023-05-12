'use strict';

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Add seed commands here.
    const data = generate_data(75)
    await queryInterface.bulkInsert('outlets', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('outlets', null, {})
  }
}


const generate_data = (jumlah) => {
  var data = []

  for(var i=0; i<jumlah; i++){
    data.push({
      kode: faker.random.locale(),
      nama: faker.name.firstName(),
      telepon: faker.phone.phoneNumber(),
      alamat: faker.address.city(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return data
}