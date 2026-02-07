
# Fix Build Error, Spreadsheet Sync & Favicon Issues

## Overview
This plan addresses three issues: a build error in the Wishlist page, the spreadsheet upload not properly parsing your inventory file, and missing favicon images.

---

## Issue 1: Build Error in Wishlist.tsx

**Problem:** The Wishlist page creates a mock product object missing the required `sizes` property.

**Solution:** Add the `sizes` property to the object passed to `mapMockToShopify`.

**File:** `src/pages/Wishlist.tsx` (lines 33-42)

Change from:
```typescript
product={mapMockToShopify({
  id: item.id.replace('gid://shopify/Product/', ''),
  title: item.title,
  handle: item.handle,
  price: parseFloat(item.price),
  images: [item.image],
  category: 'Top',
  productType: 'Bikini',
  colors: []
})}
```

Change to:
```typescript
product={mapMockToShopify({
  id: item.id.replace('gid://shopify/Product/', ''),
  title: item.title,
  handle: item.handle,
  price: parseFloat(item.price),
  images: [item.image],
  category: 'Top',
  productType: 'Bikini',
  colors: [],
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL']
})}
```

---

## Issue 2: Spreadsheet Sync Not Parsing Your Inventory File

**Problem:** Your Excel file has these columns:
- `Item ID` → needs to map to `id`
- `Item name` → needs to map to `title`  
- `Price` → already maps to `price`
- `Stock` → already maps to `inventory` (this works)
- `Type` → needs to map to `productType`
- `Collection` → can be used for collections/categories

**Solution:** Update the spreadsheet parser to recognize these additional column name variations.

**File:** `src/lib/spreadsheet.ts`

Expand the column name mappings to handle variations from your inventory file.

---

## Issue 3: Favicon Not Showing

**Problem:** The `index.html` references these favicon files that don't exist:
- `/assets/favicon-32x32.png`
- `/assets/favicon-16x16.png`
- `/assets/apple-touch-icon.png`

**Solution:** You mentioned you uploaded favicons previously. To fix this:
1. Please upload the favicon images again (I'll copy them to `public/assets/`)
2. Or provide a URL to your favicon image and I'll update the references

---

## Technical Details

### Spreadsheet Parser Updates (`src/lib/spreadsheet.ts`)

Add mappings for your inventory file's column names:

```typescript
// Map common variations to standard keys
if (['stock', 'qty', 'quantity'].includes(normalizedKey)) {
  normalizedKey = 'inventory';
}
if (['item id', 'itemid', 'sku', 'product_id', 'productid'].includes(normalizedKey)) {
  normalizedKey = 'id';
}
if (['item name', 'itemname', 'product_name', 'productname', 'name'].includes(normalizedKey)) {
  normalizedKey = 'title';
}
if (['type', 'product type', 'producttype', 'category'].includes(normalizedKey)) {
  normalizedKey = 'producttype';
}
if (['collection', 'collections'].includes(normalizedKey)) {
  normalizedKey = 'collection';
}
```

### Spreadsheet Sync Hook Updates (`src/hooks/useSpreadsheetSync.ts`)

Parse size from the `Item name` field (e.g., "White Top (XS)" → extract "XS" as the size).

Group items by base product name to aggregate inventory by size.

---

## What This Enables

After these changes, when you upload your inventory Excel file:

1. Products will be created/updated based on the `Item ID` and `Item name`
2. Stock levels from the `Stock` column will populate inventory
3. Prices from the `Price` column will be used
4. The `Collection` column will be used for product categorization
5. Sizes will be extracted from item names like "White Top (XS)"

---

## Next Steps After Approval

1. I'll fix the build error first
2. Update the spreadsheet parser
3. For the favicon: please upload your favicon images or provide a URL
