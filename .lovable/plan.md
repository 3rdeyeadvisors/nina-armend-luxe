
# Fix Wishlist Build Error

## Problem
The `Wishlist.tsx` file creates a mock product object for `mapMockToShopify()` but is missing the required `productType` property.

**Error location**: Line 33 in `src/pages/Wishlist.tsx`
```typescript
mapMockToShopify({
  id: item.id.replace('gid://shopify/Product/', ''),
  title: item.title,
  handle: item.handle,
  price: parseFloat(item.price),
  images: [item.image],
  category: 'Top',
  colors: []  // Missing: productType
})
```

## Solution
Add the missing `productType` property to match the `MockProduct` interface.

### Technical Details

**File: `src/pages/Wishlist.tsx`** (line ~33)

Add `productType: 'Bikini'` (or derive from category) to the object:

```typescript
mapMockToShopify({
  id: item.id.replace('gid://shopify/Product/', ''),
  title: item.title,
  handle: item.handle,
  price: parseFloat(item.price),
  images: [item.image],
  category: 'Top',
  productType: 'Bikini',  // Add this line
  colors: []
})
```

This is a one-line fix that will resolve the TypeScript error immediately.
