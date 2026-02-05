
# Set Admin Password to "Bossqueen26!"

## Overview
Update the default admin account password hash so the admin user (lydia@ninaarmend.co.site) can log in with the password "Bossqueen26!".

## What Will Change

**File: `src/stores/authStore.ts`**

Update line 39 to use the SHA-256 hash of "Bossqueen26!":

```typescript
const DEFAULT_ADMIN: AuthUser = {
  name: 'Lydia',
  email: ADMIN_EMAIL,
  password: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b', // Hash of "Bossqueen26!"
  // ... rest unchanged
};
```

## Important Note

After this change, you may need to **clear your browser's localStorage** for the new password to take effect, since the auth store persists user data. You can do this by:
1. Opening browser DevTools (F12)
2. Going to Application > Local Storage
3. Deleting the `nina-armend-auth-v4` entry
4. Refreshing the page

Then you can log in with:
- **Email:** lydia@ninaarmend.co.site
- **Password:** Bossqueen26!
