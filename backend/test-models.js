const { sequelize, Category, Subcategory, Product, ProductVariant, AttributeDef, VariantAttribute, Vendor, VendorListing, VendorPrice, ProductPhoto, VariantPhoto, VendorListingPhoto } = require('./src/models');

async function testModels() {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');

    console.log('\n🧪 Testing model associations...');

    // Test creating a new category or use existing one
    let category = await Category.findOne({ where: { name: 'Test Tableware' } });
    if (!category) {
      category = await Category.create({
        name: 'Test Tableware'
      });
      console.log('✅ Category created:', category.name);
    } else {
      console.log('✅ Category found:', category.name);
    }

    // Test creating a subcategory with association
    let subcategory = await Subcategory.findOne({ where: { name: 'Test Plates', category_id: category.id } });
    if (!subcategory) {
      subcategory = await Subcategory.create({
        category_id: category.id,
        name: 'Test Plates'
      });
      console.log('✅ Subcategory created:', subcategory.name);
    } else {
      console.log('✅ Subcategory found:', subcategory.name);
    }

    // Test creating a product with association
    let product = await Product.findOne({ where: { product_code: 'PLT-TEST-001' } });
    if (!product) {
      product = await Product.create({
        subcategory_id: subcategory.id,
        product_code: 'PLT-TEST-001',
        name: 'Test Round Plate',
        description: 'Classic round dinner plate for testing',
        default_uom: 'piece'
      });
      console.log('✅ Product created:', product.name);
    } else {
      console.log('✅ Product found:', product.name);
    }

    // Get or create attribute definitions
    let colorAttr = await AttributeDef.findOne({ where: { name: 'color' } });
    let sizeAttr = await AttributeDef.findOne({ where: { name: 'diameter_in' } });

    if (!colorAttr) {
      colorAttr = await AttributeDef.create({
        name: 'color',
        value_type: 'text'
      });
    }

    if (!sizeAttr) {
      sizeAttr = await AttributeDef.create({
        name: 'diameter_in',
        value_type: 'number'
      });
    }
    console.log('✅ Attribute definitions ready');

    // Test creating a product variant
    let variant = await ProductVariant.findOne({ where: { variant_sku: 'PLT-TEST-WHT-6IN' } });
    if (!variant) {
      variant = await ProductVariant.create({
        product_id: product.id,
        variant_sku: 'PLT-TEST-WHT-6IN'
      });
      console.log('✅ Product variant created:', variant.variant_sku);
    } else {
      console.log('✅ Product variant found:', variant.variant_sku);
    }

    // Test creating variant attributes
    const existingColorAttr = await VariantAttribute.findOne({
      where: { variant_id: variant.id, attribute_def_id: colorAttr.id }
    });

    if (!existingColorAttr) {
      await VariantAttribute.create({
        variant_id: variant.id,
        attribute_def_id: colorAttr.id,
        value_text: 'White'
      });

      await VariantAttribute.create({
        variant_id: variant.id,
        attribute_def_id: sizeAttr.id,
        value_text: '6'
      });
      console.log('✅ Variant attributes created');
    } else {
      console.log('✅ Variant attributes already exist');
    }

    // Test creating a vendor
    let vendor = await Vendor.findOne({ where: { vendor_code: 'TEST-VND001' } });
    if (!vendor) {
      vendor = await Vendor.create({
        vendor_code: 'TEST-VND001',
        name: 'Test Tableware Co.',
        gstin: '22AAAAA0000A1Z5',
        contact_info: {
          email: 'contact@testtableware.com',
          phone: '+91-9876543210'
        },
        rating: 4.5,
        active: true
      });
      console.log('✅ Vendor created:', vendor.name);
    } else {
      console.log('✅ Vendor found:', vendor.name);
    }

    // Test creating a vendor listing
    let listing = await VendorListing.findOne({
      where: { variant_id: variant.id, vendor_id: vendor.id }
    });
    if (!listing) {
      listing = await VendorListing.create({
        variant_id: variant.id,
        vendor_id: vendor.id,
        vendor_sku: 'TT-PLT-WHT-6',
        pack_size: 12.00,
        currency: 'INR',
        min_order_qty: 24,
        lead_time_days: 7
      });
      console.log('✅ Vendor listing created');
    } else {
      console.log('✅ Vendor listing found');
    }

    // Test creating a vendor price
    const existingPrice = await VendorPrice.findOne({
      where: { vendor_listing_id: listing.id, effective_from: '2025-01-01' }
    });

    if (!existingPrice) {
      const price = await VendorPrice.create({
        vendor_listing_id: listing.id,
        price: 45.50,
        effective_from: '2025-01-01'
      });
      console.log('✅ Vendor price created:', price.price);
    } else {
      console.log('✅ Vendor price already exists');
    }

    // Test associations with includes
    console.log('\n🔗 Testing associations...');

    const productWithDetails = await Product.findOne({
      where: { id: product.id },
      include: [
        {
          model: Subcategory,
          as: 'subcategory',
          include: [{ model: Category, as: 'category' }]
        },
        {
          model: ProductVariant,
          as: 'variants',
          include: [
            {
              model: VariantAttribute,
              as: 'attributes',
              include: [{ model: AttributeDef, as: 'attributeDef' }]
            },
            {
              model: VendorListing,
              as: 'vendorListings',
              include: [
                { model: Vendor, as: 'vendor' },
                { model: VendorPrice, as: 'prices' }
              ]
            }
          ]
        }
      ]
    });

    console.log('✅ Product with full associations retrieved:');
    console.log(`   Category: ${productWithDetails.subcategory.category.name}`);
    console.log(`   Subcategory: ${productWithDetails.subcategory.name}`);
    console.log(`   Product: ${productWithDetails.name}`);
    console.log(`   Variant: ${productWithDetails.variants[0].variant_sku}`);
    console.log(`   Attributes: ${productWithDetails.variants[0].attributes.length} attributes`);
    console.log(`   Vendor: ${productWithDetails.variants[0].vendorListings[0].vendor.name}`);
    console.log(`   Price: ₹${productWithDetails.variants[0].vendorListings[0].prices[0].price}`);

    console.log('\n🎉 All tests passed! Database schema and models are working correctly.');

    // Show seeded data
    console.log('\n📊 Checking seeded data...');
    const categories = await Category.findAll();
    const subcategories = await Subcategory.findAll();
    const attributes = await AttributeDef.findAll();

    console.log(`✅ Found ${categories.length} categories: ${categories.map(c => c.name).join(', ')}`);
    console.log(`✅ Found ${subcategories.length} subcategories`);
    console.log(`✅ Found ${attributes.length} attribute definitions: ${attributes.map(a => a.name).join(', ')}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
  }
}

testModels();
