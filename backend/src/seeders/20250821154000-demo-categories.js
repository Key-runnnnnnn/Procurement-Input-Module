'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert categories
    const categories = await queryInterface.bulkInsert('categories', [
      {
        name: 'Tableware',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Cookware',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Glassware',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });

    // Get category IDs by querying the database
    const tableware = await queryInterface.sequelize.query(
      "SELECT id FROM categories WHERE name = 'Tableware'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const cookware = await queryInterface.sequelize.query(
      "SELECT id FROM categories WHERE name = 'Cookware'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const glassware = await queryInterface.sequelize.query(
      "SELECT id FROM categories WHERE name = 'Glassware'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Insert subcategories
    await queryInterface.bulkInsert('subcategories', [
      {
        category_id: tableware[0].id,
        name: 'Plates',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: tableware[0].id,
        name: 'Bowls',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: tableware[0].id,
        name: 'Cutlery',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: cookware[0].id,
        name: 'Pots',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: cookware[0].id,
        name: 'Pans',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: glassware[0].id,
        name: 'Drinking Glasses',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Insert attribute definitions
    await queryInterface.bulkInsert('attribute_defs', [
      {
        name: 'color',
        value_type: 'text'
      },
      {
        name: 'diameter_in',
        value_type: 'number'
      },
      {
        name: 'volume_ml',
        value_type: 'number'
      },
      {
        name: 'material',
        value_type: 'text'
      },
      {
        name: 'shape',
        value_type: 'text'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attribute_defs', null, {});
    await queryInterface.bulkDelete('subcategories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};
