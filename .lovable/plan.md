

## Fix Signup/Login: Restore Environment Configuration

Your signup is failing because the `.env` file is missing. The app falls back to a placeholder URL that doesn't work.

---

### What's Happening

When you try to sign up, the request goes to:
```
POST https://placeholder.supabase.co/auth/v1/signup
```

It should go to:
```
POST https://ykhgqjownxmioexytfzc.supabase.co/auth/v1/signup
```

---

### The Fix

**Step 1: Create the `.env` file** with the correct credentials:

```
VITE_SUPABASE_PROJECT_ID="ykhgqjownxmioexytfzc"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraGdxam93bnhtaW9leHl0ZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Njc0MTksImV4cCI6MjA4NjE0MzQxOX0.fTKjyR0Sb6VYPyW4YfwWQYWNWS_CsxUlS8qhg61i2q4"
VITE_SUPABASE_URL="https://ykhgqjownxmioexytfzc.supabase.co"
```

**Step 2: Refresh the preview** to pick up the new environment variables.

**Step 3: Sign up** with:
- Email: `lydia@ninaarmend.co.site`
- Password: `Bossqueen26!`

---

### After Signup

Once you sign up successfully:
- The database trigger automatically creates your profile
- The trigger automatically grants you admin role (because your email matches the owner email)
- You'll have 250 welcome points

---

### Technical Details

| File | Change |
|------|--------|
| `.env` | Create file with Supabase credentials |

The client at `src/integrations/supabase/client.ts` reads `VITE_SUPABASE_URL` from environment. When missing, it defaults to `placeholder.supabase.co` which causes all auth requests to fail.

