

## Fix Share Functionality

### Problem
1. **LinkedIn** share uses `share-offsite` API which only accepts a URL — no prefilled text support. The shared URL is just `https://untutorial.in` with no context.
2. **X/Twitter** share encodes the text but doesn't pass a separate `url` param, and the LinkedIn URL has no text at all.

### Solution

**X/Twitter fix**: Add a `&url=` parameter to the tweet intent URL so the link is included alongside the text.

**LinkedIn fix**: LinkedIn's `share-offsite` API is limited — it only takes a URL. To get prefilled text, switch to LinkedIn's share endpoint that supports `summary` and `title` params, OR simply include a well-crafted URL. The most reliable approach is to keep using `share-offsite` but ensure the shared URL has proper Open Graph meta tags on `untutorial.in` so the preview looks good. Alternatively, we can use LinkedIn's older share API format.

### Changes — `src/pages/CourseComplete.tsx`

1. **X share link**: Change to include both `text` and `url` as separate params:
   ```
   https://twitter.com/intent/tweet?text=<encoded text>&url=https://untutorial.in
   ```

2. **LinkedIn share link**: Use the feed share URL format that supports prefilled text:
   ```
   https://www.linkedin.com/feed/?shareActive=true&text=<encoded text>
   ```
   This opens LinkedIn's compose box with prefilled text (works reliably as of 2025+).

3. Remove the URL from the `shareText` variable since X will append it via the `url` param, and LinkedIn will have it in the prefilled text.

### Scope
- Single file change: `src/pages/CourseComplete.tsx`
- Update `shareText` and both share `<a>` href attributes

