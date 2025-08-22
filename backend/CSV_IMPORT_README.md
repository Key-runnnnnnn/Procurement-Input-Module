# CSV Import API Documentation

## Overview

The CSV Import functionality allows you to bulk import data for various entities in the Procurement Input Module.

## Endpoints

### 1. Import CSV Data

**POST** `/import/:entity`

Upload and import CSV data for a specific entity type.

**Parameters:**

- `entity` (path parameter): One of `categories`, `subcategories`, `products`, `variants`, `vendors`, `vendor_listings`, `vendor_prices`

**Request:**

- Content-Type: `multipart/form-data`
- Field name: `csvFile`
- File type: `.csv`
- Max file size: 10MB

**Response:**

```json
{
  "success": true,
  "message": "Import completed successfully",
  "results": {
    "totalRows": 4,
    "created": 4,
    "updated": 0,
    "errors": []
  }
}
```

### 2. Get Import Information

**GET** `/import/history`

Get supported entity types and sample CSV formats.

## Sample Usage with cURL

### Import Categories

```bash
curl -X POST http://localhost:5000/import/categories \
  -F "csvFile=@sample_csvs/categories.csv"
```

### Import Subcategories

```bash
curl -X POST http://localhost:5000/import/subcategories \
  -F "csvFile=@sample_csvs/subcategories.csv"
```

### Import Products

```bash
curl -X POST http://localhost:5000/import/products \
  -F "csvFile=@sample_csvs/products.csv"
```

## CSV Format Requirements

### Categories

- **Required:** `name`
- **Optional:** `description`
- **Unique:** `name`

### Subcategories

- **Required:** `category_id`, `name`
- **Optional:** `description`
- **Unique:** `category_id` + `name` combination

### Products

- **Required:** `subcategory_id`, `product_code`, `name`
- **Optional:** `description`, `default_uom`
- **Unique:** `product_code`

### Variants

- **Required:** `product_id`, `variant_sku`
- **Optional:** `size`, `color`, `material`
- **Unique:** `variant_sku`

### Vendors

- **Required:** `vendor_code`, `name`
- **Optional:** `gstin`, `rating`, `active`
- **Unique:** `vendor_code`

### Vendor Listings

- **Required:** `variant_id`, `vendor_id`, `pack_size`
- **Optional:** `min_order_qty`, `lead_time_days`, `active`
- **Unique:** `variant_id` + `vendor_id` combination

### Vendor Prices

- **Required:** `vendor_listing_id`, `price`, `effective_from`
- **Optional:** `effective_to`
- **Unique:** None (prices can have multiple entries with different dates)

## Validation Rules

1. **Required Field Validation**: All required fields must be present and non-empty
2. **Data Type Validation**: Numbers must be valid, dates must be parseable
3. **Business Rule Validation**:
   - Prices must be > 0
   - Pack sizes must be > 0
   - Ratings must be between 0-5
   - Lead times must be >= 0
4. **Unique Constraint Validation**:
   - Checks for duplicates within the CSV file
   - Checks against existing database records
5. **Foreign Key Validation**: References to other entities must exist

## Error Handling

The API provides detailed error messages for:

- Missing required fields
- Invalid data types
- Unique constraint violations
- Foreign key violations
- File format issues

Errors are returned with specific row numbers for easy debugging.
