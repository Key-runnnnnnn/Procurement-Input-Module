import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const db = require('./src/models/index.cjs');

// Test database connection and show available models
async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    console.log('\n📊 Available Models:');
    console.log('- Category');
    console.log('- Subcategory');
    console.log('- Product');
    console.log('- ProductVariant');
    console.log('- Vendor');
    console.log('- VendorListing');
    console.log('- VendorPrice');
    console.log('- AttributeDef');
    console.log('- VariantAttribute');

    console.log('\n🔗 CSV Import Endpoints Available:');
    console.log('- POST /import/categories');
    console.log('- POST /import/subcategories');
    console.log('- POST /import/products');
    console.log('- POST /import/variants');
    console.log('- POST /import/vendors');
    console.log('- POST /import/vendor_listings');
    console.log('- POST /import/vendor_prices');
    console.log('- GET /import/history');

    console.log('\n📁 Sample CSV files created in sample_csvs/ directory');
    console.log('\n🚀 Ready to test CSV imports!');

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

testConnection();
