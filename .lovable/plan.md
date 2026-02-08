
# Fix: Stop Auto-Scroll on Admin Pages

## Problem
The admin dashboard and products page scroll to the bottom when you navigate to them. This is caused by the AI Chat widget calling `scrollIntoView()` which scrolls the entire page, not just the chat container.

## Solution
Change the chat scroll behavior to only scroll within its own container, leaving the page position unaffected.

## Changes Required

### File: `src/pages/admin/Dashboard.tsx`

1. Add a ref for the chat messages container
2. Update `scrollToBottom()` to use `scrollTop` on the container instead of `scrollIntoView()`
3. Attach the ref to the chat messages div

**Before:**
```typescript
const chatEndRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
};
```

**After:**
```typescript
const chatContainerRef = useRef<HTMLDivElement>(null);
const chatEndRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
};
```

Then attach `chatContainerRef` to the scrollable chat messages div (the one with `overflow-y-auto`).

## Result
- Page loads at the top as expected
- AI chat still auto-scrolls internally when new messages appear
- No disruption to normal navigation behavior
