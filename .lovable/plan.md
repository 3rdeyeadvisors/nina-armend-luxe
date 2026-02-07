
# Fix Complete Spreadsheet Sync, Categories, Bulk Actions, POS Status & Size Display

## Issues Identified

### 1. Only 28 Items Syncing Instead of 53
**Root Cause Found:** Looking at your spreadsheet, the current code groups by `${baseTitle}-${collection}` (line 76 of `useSpreadsheetSync.ts`). This causes problems:

| Your Data | Current Grouping Key | Result |
|-----------|---------------------|--------|
| White Top (XS) - La Bella Collection | `White Top-La Bella Collection` | Correct |
| Black Bottom (M) - El Mar | `Black Bottom-El Mar` | Correct |
| Black Bottom (M) - La Bella Collection | `Black Bottom-La Bella Collection` | Different product - CORRECT |
| Backless One Piece (M) - *(empty)* | `Backless One Piece-default` | OK |
| Backless One-Piece (XL) - *(empty)* | `Backless One-Piece-default` | **DIFFERENT KEY!** (hyphen vs space) |

**Other Issues:**
- "Backless One Piece" vs "Backless One-Piece" creates 2 products (inconsistent naming)
- "Black One-Piece Plus" has no size in parentheses - treated as a separate product (correct, this is your 53rd item)
- No upload limit validation

**Solution:** 
- Normalize product names before grouping (handle "One Piece" vs "One-Piece")
- Add file size limits (max 5MB, max 500 rows)
- Show upload summary with all detected products

### 2. No Category Organization
**Problem:** All 53 products in one long scrollable list

**Solution:** Auto-detect category from names and add filter tabs:
- **Tops**: Contains "Top"
- **Bottoms**: Contains "Bottom"  
- **One-Pieces**: Contains "One-Piece" or "One Piece"
- **Other**: Everything else (like "Plus" sizes)

### 3. No Bulk Selection/Delete
**Problem:** Delete products one at a time only

**Solution:** Add checkboxes, select all, and bulk delete functionality

### 4. POS Orders Go Straight to "Delivered"
**Problem:** Line 129 in `POS.tsx` sets `status: 'Delivered'`

**Solution:** Change to `status: 'Pending'` so orders follow the workflow

### 5. Size Inventory Hard to Read
**Problem:** Tiny text like `XS (5)` is hard to see

**Solution:** Larger color-coded badges:
- Green: stock > 5
- Amber: stock 1-5
- Red: out of stock (0)

---

## Technical Implementation

### File 1: `src/hooks/useSpreadsheetSync.ts`

**Changes:**

1. **Add upload limits and validation:**
```typescript
// Max 5MB file size, max 500 rows
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ROWS = 500;

if (spreadsheetFile.size > MAX_FILE_SIZE) {
  toast.error("File too large. Maximum 5MB allowed.");
  return;
}
```

2. **Normalize product names before grouping:**
```typescript
// Normalize title to handle inconsistencies like "One Piece" vs "One-Piece"
const normalizeTitle = (title: string) => {
  return title
    .replace(/one piece/gi, 'One-Piece')  // Standardize "One Piece" → "One-Piece"
    .replace(/\s+/g, ' ')                   // Collapse multiple spaces
    .trim();
};
```

3. **Fix grouping logic - group by normalized base title only:**
```typescript
const normalizedTitle = normalizeTitle(title);
const sizeMatch = normalizedTitle.match(/\(([^)]+)\)$/);
const size = sizeMatch ? sizeMatch[1].toUpperCase() : null;
const baseTitle = sizeMatch 
  ? normalizedTitle.replace(/\s*\([^)]+\)$/, '').trim() 
  : normalizedTitle;

// Group by base title only (collection stored separately, not in key)
const groupKey = baseTitle;
```

4. **Auto-detect category from name:**
```typescript
const detectCategory = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('one-piece') || t.includes('one piece')) return 'One-Piece';
  if (t.includes('bottom')) return 'Bottom';
  if (t.includes('top')) return 'Top';
  return 'Other';
};

// Include in product override
updateProductOverride(id, {
  ...existingFields,
  category: detectCategory(product.baseTitle)
});
```

5. **Add row count validation:**
```typescript
if (rows.length > MAX_ROWS) {
  toast.error(`Too many rows (${rows.length}). Maximum ${MAX_ROWS} allowed.`);
  return;
}
```

### File 2: `src/stores/adminStore.ts`

**Changes:**
- Add `category` field to ProductOverride interface (already exists as optional - ensure it's being used)

### File 3: `src/pages/admin/Products.tsx`

**Changes:**

1. **Add category filter state and tabs:**
```typescript
const [selectedCategory, setSelectedCategory] = useState<string>('All');
const categories = ['All', 'Top', 'Bottom', 'One-Piece', 'Other'];

// Filter by category
const filteredProducts = useMemo(() => {
  let result = products;
  if (selectedCategory !== 'All') {
    result = result.filter(p => {
      const override = productOverrides[p.node.id];
      return override?.category === selectedCategory;
    });
  }
  return result;
}, [products, selectedCategory, productOverrides]);
```

2. **Add category tabs UI:**
```jsx
<div className="flex gap-2 flex-wrap">
  {categories.map(cat => (
    <Button
      key={cat}
      variant={selectedCategory === cat ? "default" : "outline"}
      size="sm"
      onClick={() => setSelectedCategory(cat)}
    >
      {cat} ({countByCategory[cat]})
    </Button>
  ))}
</div>
```

3. **Add bulk selection state:**
```typescript
const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

const toggleSelectAll = () => {
  if (selectedProducts.size === filteredProducts.length) {
    setSelectedProducts(new Set());
  } else {
    setSelectedProducts(new Set(filteredProducts.map(p => p.node.id)));
  }
};

const bulkDelete = () => {
  selectedProducts.forEach(id => deleteProduct(id));
  toast.success(`${selectedProducts.size} products deleted`);
  setSelectedProducts(new Set());
};
```

4. **Add checkbox column and bulk delete button:**
```jsx
// Header checkbox
<TableHead className="w-10">
  <Checkbox 
    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
    onCheckedChange={toggleSelectAll}
  />
</TableHead>

// Bulk delete button (shown when items selected)
{selectedProducts.size > 0 && (
  <Button variant="destructive" onClick={bulkDelete}>
    Delete {selectedProducts.size} Selected
  </Button>
)}
```

5. **Improve size inventory display with color-coded badges:**
```jsx
<TableCell>
  <div className="flex flex-wrap gap-1.5">
    {sizes.map(s => {
      const stock = sizeInventory?.[s] ?? 0;
      const colorClass = stock === 0 
        ? 'bg-red-100 text-red-700 border-red-200' 
        : stock <= 5 
          ? 'bg-amber-100 text-amber-700 border-amber-200'
          : 'bg-emerald-100 text-emerald-700 border-emerald-200';
      
      return (
        <span 
          key={s} 
          className={`px-2 py-1 rounded-md border text-xs font-semibold ${colorClass}`}
        >
          {s}: {stock}
        </span>
      );
    })}
  </div>
</TableCell>
```

### File 4: `src/pages/admin/POS.tsx`

**Change line 129:**
```typescript
// Before
status: 'Delivered',

// After  
status: 'Pending',
```

---

## Expected Results After Implementation

| Your Spreadsheet | Products Created |
|------------------|------------------|
| White Top (XS, S) | 1 product: "White Top" with XS:6, S:10 |
| White Bottom (XS, S) | 1 product: "White Bottom" with XS:6, S:10 |
| Black Top (M, L, XL) | 1 product: "Black Top" with M:4, L:4, XL:2 |
| Black Bottom (M, L, XL) | 1 product: "Black Bottom" with M:4, L:4, XL:2 |
| One-Piece (M, L, XL, 2XL) | 1 product: "One-Piece" with M:2, L:5, XL:5, 2XL:5 |
| Backless One-Piece (M, L, XL, 2XL) | 1 product: "Backless One-Piece" (normalized) |
| Blue & White Top (S) | 1 product: "Blue & White Top" |
| ... and so on | |
| Black One-Piece Plus | 1 product: "Black One-Piece Plus" (no size, full stock) |

**Total: All 53 items properly grouped into unique products**

---

## Files to Modify

1. `src/hooks/useSpreadsheetSync.ts` - Fix grouping, add limits, add category detection
2. `src/stores/adminStore.ts` - Confirm category field (already exists)
3. `src/pages/admin/Products.tsx` - Category tabs, bulk selection, better size display
4. `src/pages/admin/POS.tsx` - Change order status from 'Delivered' to 'Pending'
