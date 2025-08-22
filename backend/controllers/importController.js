import CSVImportService from '../services/csvImportService.js';

export const importCSV = async (req, res) => {
  try {
    const { entity } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
    }

    // Validate entity type
    const allowedEntities = ['categories', 'subcategories', 'products', 'variants', 'vendors', 'vendor_listings', 'vendor_prices'];
    if (!allowedEntities.includes(entity)) {
      return res.status(400).json({
        success: false,
        message: `Invalid entity type. Allowed: ${allowedEntities.join(', ')}`
      });
    }

    console.log(`Starting CSV import for entity: ${entity}, file: ${req.file.originalname}`);

    // Import CSV
    const result = await CSVImportService.importCSV(req.file.path, entity);

    console.log(`Import completed for ${entity}:`, result);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get import status/history
export const getImportHistory = async (req, res) => {
  res.json({
    message: 'Import history endpoint - to be implemented',
    supportedEntities: ['categories', 'subcategories', 'products', 'variants', 'vendors', 'vendor_listings', 'vendor_prices'],
    sampleCSVFormats: {
      categories: {
        required: ['name'],
        optional: ['description'],
        example: 'name,description\nTableware,Plates and bowls\nCookware,Pots and pans'
      },
      subcategories: {
        required: ['category_id', 'name'],
        optional: ['description'],
        example: 'category_id,name,description\n1,Plates,Dinner plates\n1,Bowls,Serving bowls'
      },
      products: {
        required: ['subcategory_id', 'product_code', 'name'],
        optional: ['description', 'default_uom'],
        example: 'subcategory_id,product_code,name,description,default_uom\n1,PLT-001,Ceramic Plate,High quality plate,piece'
      },
      variants: {
        required: ['product_id', 'variant_sku'],
        optional: ['size', 'color', 'material'],
        example: 'product_id,variant_sku,size,color,material\n1,PLT-001-WHT-6IN,6 inch,White,Ceramic'
      },
      vendors: {
        required: ['vendor_code', 'name'],
        optional: ['gstin', 'rating', 'active'],
        example: 'vendor_code,name,gstin,rating,active\nVND001,ABC Suppliers,12ABCDE1234F1Z5,4.5,true'
      },
      vendor_listings: {
        required: ['variant_id', 'vendor_id', 'pack_size'],
        optional: ['min_order_qty', 'lead_time_days', 'active'],
        example: 'variant_id,vendor_id,pack_size,min_order_qty,lead_time_days,active\n1,1,12,24,7,true'
      },
      vendor_prices: {
        required: ['vendor_listing_id', 'price', 'effective_from'],
        optional: ['effective_to'],
        example: 'vendor_listing_id,price,effective_from,effective_to\n1,25.50,2024-01-01,2024-12-31'
      }
    }
  });
};
