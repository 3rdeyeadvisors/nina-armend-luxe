
## Fix: Check Cloud Auth for Admin Access

### The Problem
You're logged in via **Cloud Auth** (Supabase authentication in the browser), but the sync code only checks the **legacy auth store** which is empty.

| Line 58 in useProductsDb.ts | What It Does |
|----------------------------|--------------|
| `useAuthStore.getState().user?.email` | Only checks legacy localStorage auth (empty) |
| Missing: `useCloudAuthStore` | Never checks your actual browser login |

### The Fix

Update `src/hooks/useProductsDb.ts` to check **both** auth systems:

**Line 4** - Add import:
```typescript
import { useCloudAuthStore } from '@/stores/cloudAuthStore';
```

**Lines 56-64** - Check both auth stores:
```typescript
const syncWithEdgeFunction = async (products: ProductOverride | ProductOverride[]) => {
  try {
    // Check both legacy and cloud auth systems
    const legacyEmail = useAuthStore.getState().user?.email;
    const cloudEmail = useCloudAuthStore.getState().user?.email;
    const userEmail = legacyEmail || cloudEmail;

    if (!userEmail || userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      console.error('Admin access required to sync products');
      toast.error('Admin login required to save products to database. Please log in.');
      return false;
    }
    // ... rest unchanged
```

### File to Modify

| File | Change |
|------|--------|
| `src/hooks/useProductsDb.ts` | Import `useCloudAuthStore` and check both auth systems |

### Expected Result

After this fix, when you upload a spreadsheet while logged into the browser:
- Your Cloud Auth email will be detected
- Admin check will pass
- Products will sync to the database
- Products will persist after page refresh
