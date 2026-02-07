
# Simplified Spreadsheet Upload Format

## Overview
You want a cleaner, more straightforward spreadsheet format with these exact columns:

| Column | Maps To | Purpose |
|--------|---------|---------|
| Item ID | Product ID | Unique identifier |
| Item Name | Product Title | Product name (with size in parentheses) |
| Type | Category | Top, Bottom, One-Piece, Other |
| Price Per Unit | Price | Product price |
| Stock | Inventory | Quantity available |
| Collection | Collection | Which collection it belongs to |
| Status | Status | Active, Inactive, Draft |

## Changes

### 1. Update Spreadsheet Parser

**File:** `src/lib/spreadsheet.ts`

Update the column mappings to match your exact column names:

```text
Column Name Variations → Internal Key
─────────────────────────────────────
"item id"              → id
"item name"            → title
"type"                 → producttype (used as category)
"price per unit"       → price
"stock"                → inventory
"collection"           → collection
"status"               → status (NEW)
```

### 2. Update Sync Logic

**File:** `src/hooks/useSpreadsheetSync.ts`

- Use the `Type` column directly as the category (no auto-detection needed)
- Add `status` field to product overrides
- Simplify the grouping to work with your exact format

### 3. Update Product Interface

**File:** `src/stores/adminStore.ts`

Add `status` field to ProductOverride:
```typescript
status?: 'Active' | 'Inactive' | 'Draft';
```

### 4. Update CSV Template

The downloadable template will match your exact format:

```csv
Item ID,Item Name,Type,Price Per Unit,Stock,Collection,Status
LB-001,White Top (XS),Top,85.00,10,La Bella,Active
LB-002,White Top (S),Top,85.00,15,La Bella,Active
LB-003,White Bottom (XS),Bottom,75.00,8,La Bella,Active
EM-001,Black One-Piece (M),One-Piece,120.00,5,El Mar,Active
EM-002,Black One-Piece Plus,One-Piece,130.00,3,El Mar,Active
```

---

## Technical Details

### Spreadsheet Parser (`src/lib/spreadsheet.ts`)

```typescript
// Column mappings for your exact format
if (['item id', 'itemid', 'sku', 'product_id', 'productid', 'id'].includes(normalizedKey)) {
  normalizedKey = 'id';
}
if (['item name', 'itemname', 'product_name', 'productname', 'name', 'title'].includes(normalizedKey)) {
  normalizedKey = 'title';
}
if (['type', 'product type', 'producttype', 'category'].includes(normalizedKey)) {
  normalizedKey = 'producttype';
}
if (['price per unit', 'unit price', 'price', 'cost'].includes(normalizedKey)) {
  normalizedKey = 'price';
}
if (['stock', 'qty', 'quantity', 'inventory'].includes(normalizedKey)) {
  normalizedKey = 'inventory';
}
if (['collection', 'collections'].includes(normalizedKey)) {
  normalizedKey = 'collection';
}
if (['status', 'product status'].includes(normalizedKey)) {
  normalizedKey = 'status';
}
```

### Sync Hook Updates (`src/hooks/useSpreadsheetSync.ts`)

- Use `Type` column directly as category instead of auto-detecting from name
- Add status field to product updates
- Keep the size extraction from `Item Name` (e.g., "White Top (XS)" → size: XS)

### Store Update (`src/stores/adminStore.ts`)

```typescript
export interface ProductOverride {
  // ... existing fields
  status?: 'Active' | 'Inactive' | 'Draft';
}
```

---

## Files to Modify

1. `src/lib/spreadsheet.ts` - Update column mappings
2. `src/hooks/useSpreadsheetSync.ts` - Use Type as category, add status
3. `src/stores/adminStore.ts` - Add status field to interface

---

## Expected Result

After upload, your 53 items will sync with:
- Proper categorization from the `Type` column
- Correct pricing from `Price Per Unit`
- Stock levels from `Stock`
- Collection assignment from `Collection`
- Active/Inactive status from `Status`
- Sizes extracted from item names automatically
