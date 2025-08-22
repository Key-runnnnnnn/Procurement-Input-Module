import fs from 'fs';
import csv from 'csv-parser';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const db = require('../src/models/index.cjs');

const { Category, Subcategory, Product, ProductVariant, Vendor, VendorListing, VendorPrice, AttributeDef, VariantAttribute } = db;

class CSVImportService {

  // Validation rules for each entity
  static validationRules = {
    categories: {
      required: ['name'],
      unique: ['name'],
      rules: {
        name: (value) => value && value.length <= 120 && value.length > 0
      }
    },
    subcategories: {
      required: ['category_id', 'name'],
      unique: [['category_id', 'name']],
      rules: {
        name: (value) => value && value.length <= 120 && value.length > 0,
        category_id: (value) => value && !isNaN(value) && parseInt(value) > 0
      }
    },
    products: {
      required: ['subcategory_id', 'product_code', 'name'],
      unique: ['product_code'],
      rules: {
        product_code: (value) => value && value.length <= 40 && value.length > 0,
        name: (value) => value && value.length <= 160 && value.length > 0,
        subcategory_id: (value) => value && !isNaN(value) && parseInt(value) > 0
      }
    },
    variants: {
      required: ['product_id', 'variant_sku'],
      unique: ['variant_sku'],
      rules: {
        variant_sku: (value) => value && value.length <= 64 && value.length > 0,
        product_id: (value) => value && !isNaN(value) && parseInt(value) > 0
      }
    },
    vendors: {
      required: ['vendor_code', 'name'],
      unique: ['vendor_code'],
      rules: {
        vendor_code: (value) => value && value.length <= 32 && value.length > 0,
        name: (value) => value && value.length <= 180 && value.length > 0,
        rating: (value) => !value || (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 5)
      }
    },
    vendor_listings: {
      required: ['variant_id', 'vendor_id', 'pack_size'],
      unique: [['variant_id', 'vendor_id']],
      rules: {
        variant_id: (value) => value && !isNaN(value) && parseInt(value) > 0,
        vendor_id: (value) => value && !isNaN(value) && parseInt(value) > 0,
        pack_size: (value) => value && !isNaN(value) && parseFloat(value) > 0,
        min_order_qty: (value) => !value || (!isNaN(value) && parseInt(value) >= 0),
        lead_time_days: (value) => !value || (!isNaN(value) && parseInt(value) >= 0)
      }
    },
    vendor_prices: {
      required: ['vendor_listing_id', 'price', 'effective_from'],
      unique: [],
      rules: {
        vendor_listing_id: (value) => value && !isNaN(value) && parseInt(value) > 0,
        price: (value) => value && !isNaN(value) && parseFloat(value) > 0,
        effective_from: (value) => value && !isNaN(Date.parse(value))
      }
    }
  };

  // Parse CSV file and return rows
  static async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Trim whitespace from all values
          const cleanRow = {};
          Object.keys(row).forEach(key => {
            cleanRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          });
          rows.push(cleanRow);
        })
        .on('end', () => resolve(rows))
        .on('error', (error) => reject(error));
    });
  }

  // Validate a single row
  static validateRow(row, entity, rowIndex) {
    const rules = this.validationRules[entity];
    if (!rules) {
      return [`Row ${rowIndex + 1}: Unknown entity type '${entity}'`];
    }

    const errors = [];

    // Check required fields
    rules.required.forEach(field => {
      if (!row[field] || row[field] === '') {
        errors.push(`Row ${rowIndex + 1}: Missing required field '${field}'`);
      }
    });

    // Check field-specific validation rules
    Object.keys(rules.rules).forEach(field => {
      if (row[field] !== undefined && row[field] !== '') {
        const isValid = rules.rules[field](row[field]);
        if (!isValid) {
          errors.push(`Row ${rowIndex + 1}: Invalid value for field '${field}': '${row[field]}'`);
        }
      }
    });

    return errors;
  }

  // Check for unique constraint violations
  static async checkUniqueConstraints(rows, entity) {
    const rules = this.validationRules[entity];
    const errors = [];
    const seen = new Set();

    // Check within the CSV file itself
    rows.forEach((row, index) => {
      rules.unique.forEach(uniqueField => {
        let key;
        if (Array.isArray(uniqueField)) {
          // Composite unique key
          key = uniqueField.map(field => row[field]).join('|');
        } else {
          // Single unique key
          key = row[uniqueField];
        }

        if (key && seen.has(key)) {
          errors.push(`Row ${index + 1}: Duplicate ${Array.isArray(uniqueField) ? uniqueField.join('+') : uniqueField}: '${key}'`);
        } else if (key) {
          seen.add(key);
        }
      });
    });

    // Check against existing database records
    await this.checkDatabaseUnique(rows, entity, errors);

    return errors;
  }

  // Check unique constraints against database
  static async checkDatabaseUnique(rows, entity, errors) {
    const rules = this.validationRules[entity];

    for (const uniqueField of rules.unique) {
      if (Array.isArray(uniqueField)) {
        // Handle composite unique keys
        const conditions = rows.map(row => {
          const condition = {};
          uniqueField.forEach(field => {
            condition[field] = row[field];
          });
          return condition;
        });

        // Check each combination
        for (let i = 0; i < conditions.length; i++) {
          const existing = await this.findExistingRecord(entity, conditions[i]);
          if (existing) {
            const keyStr = uniqueField.map(field => conditions[i][field]).join('+');
            errors.push(`Row ${i + 1}: ${uniqueField.join('+')} '${keyStr}' already exists in database`);
          }
        }
      } else {
        // Handle single unique keys
        const values = rows.map(row => row[uniqueField]).filter(v => v);
        const existing = await this.findExistingRecords(entity, uniqueField, values);

        rows.forEach((row, index) => {
          if (row[uniqueField] && existing.includes(row[uniqueField])) {
            errors.push(`Row ${index + 1}: ${uniqueField} '${row[uniqueField]}' already exists in database`);
          }
        });
      }
    }
  }

  // Find existing record by composite key
  static async findExistingRecord(entity, condition) {
    const model = this.getModel(entity);
    if (!model) return null;

    try {
      return await model.findOne({ where: condition });
    } catch (error) {
      console.error(`Error checking existing record for ${entity}:`, error);
      return null;
    }
  }

  // Find existing records by single field
  static async findExistingRecords(entity, field, values) {
    const model = this.getModel(entity);
    if (!model || values.length === 0) return [];

    try {
      const records = await model.findAll({
        where: {
          [field]: values
        },
        attributes: [field]
      });
      return records.map(record => record[field]);
    } catch (error) {
      console.error(`Error checking existing records for ${entity}:`, error);
      return [];
    }
  }

  // Get Sequelize model by entity name
  static getModel(entity) {
    const modelMap = {
      'categories': Category,
      'subcategories': Subcategory,
      'products': Product,
      'variants': ProductVariant,
      'vendors': Vendor,
      'vendor_listings': VendorListing,
      'vendor_prices': VendorPrice
    };
    return modelMap[entity];
  }

  // Import data with upsert
  static async importData(rows, entity) {
    const model = this.getModel(entity);
    if (!model) {
      throw new Error(`Unknown entity: ${entity}`);
    }

    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        // Convert string values to appropriate types
        const processedRow = this.processRowData(row, entity);

        const [record, created] = await model.upsert(processedRow);

        if (created) {
          results.created++;
        } else {
          results.updated++;
        }
      } catch (error) {
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return results;
  }

  // Process row data to convert types
  static processRowData(row, entity) {
    const processedRow = { ...row };

    // Convert numeric fields
    const numericFields = {
      categories: [],
      subcategories: ['category_id'],
      products: ['subcategory_id'],
      variants: ['product_id'],
      vendors: ['rating'],
      vendor_listings: ['variant_id', 'vendor_id', 'pack_size', 'min_order_qty', 'lead_time_days'],
      vendor_prices: ['vendor_listing_id', 'price']
    };

    // Convert boolean fields
    const booleanFields = {
      vendors: ['active'],
      vendor_listings: ['active']
    };

    // Convert date fields
    const dateFields = {
      vendor_prices: ['effective_from', 'effective_to']
    };

    // Process numeric fields
    if (numericFields[entity]) {
      numericFields[entity].forEach(field => {
        if (processedRow[field] !== undefined && processedRow[field] !== '') {
          processedRow[field] = parseFloat(processedRow[field]);
        }
      });
    }

    // Process boolean fields
    if (booleanFields[entity]) {
      booleanFields[entity].forEach(field => {
        if (processedRow[field] !== undefined && processedRow[field] !== '') {
          processedRow[field] = processedRow[field].toLowerCase() === 'true' || processedRow[field] === '1';
        }
      });
    }

    // Process date fields
    if (dateFields[entity]) {
      dateFields[entity].forEach(field => {
        if (processedRow[field] !== undefined && processedRow[field] !== '') {
          processedRow[field] = new Date(processedRow[field]);
        }
      });
    }

    return processedRow;
  }

  // Main import function
  static async importCSV(filePath, entity) {
    try {
      // Parse CSV
      const rows = await this.parseCSV(filePath);

      if (rows.length === 0) {
        return {
          success: false,
          message: 'CSV file is empty',
          results: null
        };
      }

      // Validate all rows
      const validationErrors = [];

      // Row-level validation
      rows.forEach((row, index) => {
        const rowErrors = this.validateRow(row, entity, index);
        validationErrors.push(...rowErrors);
      });

      // Unique constraint validation
      const uniqueErrors = await this.checkUniqueConstraints(rows, entity);
      validationErrors.push(...uniqueErrors);

      // If there are validation errors, return them
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
          totalRows: rows.length
        };
      }

      // Import data
      const importResults = await this.importData(rows, entity);

      return {
        success: true,
        message: 'Import completed successfully',
        results: {
          totalRows: rows.length,
          created: importResults.created,
          updated: importResults.updated,
          errors: importResults.errors
        }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Import failed',
        error: error.message
      };
    } finally {
      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error deleting uploaded file:', error);
      }
    }
  }
}

export default CSVImportService;
