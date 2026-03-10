# Accessing Waitlist Emails

This guide shows you how to access the email addresses collected from users who complete the course and join the waitlist.

## Setup (One-time)

### 1. Run the Database Migration

Apply the migration to create the `waitlist` table in your Supabase database:

```bash
# If you have Supabase CLI installed:
supabase db push

# OR manually run the SQL migration:
# 1. Go to your Supabase project dashboard
# 2. Click "SQL Editor" in the left sidebar
# 3. Copy the contents of supabase/migrations/20260310_create_waitlist_table.sql
# 4. Paste and run it
```

### 2. Verify Table Creation

In your Supabase dashboard:
1. Go to **Table Editor**
2. You should see a new table called `waitlist`
3. Columns: `id`, `email`, `total_xp`, `created_at`

## Accessing Waitlist Emails

### Method 1: Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Table Editor** in the left sidebar
4. Click on the `waitlist` table
5. You'll see all emails with:
   - Email address
   - Total XP earned
   - Signup timestamp

### Method 2: SQL Query

In the **SQL Editor**:

```sql
-- Get all waitlist signups ordered by most recent
SELECT email, total_xp, created_at
FROM waitlist
ORDER BY created_at DESC;

-- Count total signups
SELECT COUNT(*) as total_signups FROM waitlist;

-- Get signups from last 7 days
SELECT email, total_xp, created_at
FROM waitlist
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Method 3: Export to CSV

1. In **Table Editor**, click on the `waitlist` table
2. Click the **Export** button (top right)
3. Choose **CSV** format
4. Download the file

### Method 4: API Access

You can also fetch waitlist data programmatically:

```javascript
import { supabase } from '@/integrations/supabase/client';

// Fetch all waitlist emails
const { data, error } = await supabase
  .from('waitlist')
  .select('*')
  .order('created_at', { ascending: false });

if (data) {
  console.log('Waitlist emails:', data);
}
```

## Data Schema

```typescript
interface WaitlistEntry {
  id: string;           // UUID
  email: string;        // User's email (unique)
  total_xp: number;     // XP earned in the course
  created_at: string;   // Timestamp (ISO 8601)
}
```

## Privacy & Security

- Emails are stored securely in Supabase (encrypted at rest)
- Row Level Security (RLS) is enabled
- Only users with proper credentials can access the data
- Consider adding a privacy policy and terms of service

## Integration Ideas

You can integrate this with:
- **Email marketing tools**: Mailchimp, ConvertKit, SendGrid
- **CRM systems**: HubSpot, Salesforce
- **Analytics**: Export to Google Sheets, Airtable
- **Automation**: Zapier, Make.com

## Example: Export to Mailchimp

```javascript
// Fetch waitlist
const { data } = await supabase.from('waitlist').select('*');

// Format for Mailchimp
const contacts = data.map(entry => ({
  email_address: entry.email,
  status: 'subscribed',
  merge_fields: {
    XP: entry.total_xp,
    SIGNUP: entry.created_at
  }
}));

// Import to Mailchimp using their API
```

## Troubleshooting

**Q: I don't see the waitlist table**
- Make sure you ran the migration SQL in your Supabase project

**Q: Emails aren't being saved**
- Check browser console for errors
- Verify your `.env` file has correct Supabase credentials
- Check that RLS policies are properly set

**Q: How do I delete test entries?**
```sql
DELETE FROM waitlist WHERE email LIKE '%test%';
```
