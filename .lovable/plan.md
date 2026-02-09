
## Fix Product Delete Failing Due to Invalid Status Values

### What's Happening

When you try to delete products, the system is failing because some products in your local store have invalid `status` values like "In stock" or "Ordered". The database only accepts `Active`, `Inactive`, or `Draft`.

When deleting:
1. The code tries to save the full product data with `isDeleted: true`
2. The database rejects it because the status is invalid
3. This triggers an error toast for each product

This is why you're seeing "endless messages" - one error toast per product that fails to delete.

---

### The Fix

I'll update the edge function to automatically normalize invalid status values before saving to the database.

| File | Change |
|------|--------|
| `supabase/functions/sync-products/index.ts` | Add status normalization logic |

---

### Technical Details

In the edge function, I'll add validation that converts any non-standard status to a valid one:

```typescript
// Normalize status to match database constraints
let status = String(p.status || 'Active');
if (!['Active', 'Inactive', 'Draft'].includes(status)) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('active') || statusLower.includes('stock') || statusLower.includes('order')) {
    status = 'Active';
  } else if (statusLower.includes('draft')) {
    status = 'Draft';
  } else {
    status = 'Inactive';
  }
}
```

This matches the normalization already done in the spreadsheet sync, ensuring consistency.

---

### After the Fix

1. Delete operations will work for all products
2. No more endless error messages
3. Invalid statuses will be automatically corrected when saving

