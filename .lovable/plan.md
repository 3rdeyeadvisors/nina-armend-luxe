

# Fix Logo Overlapping on Home Screen

## The Problem
The header has the logo absolutely centered using `absolute left-1/2 -translate-x-1/2`, but on mobile screens:
- The hamburger menu button is on the left
- The cart icon is on the right  
- The logo (with wide letter-spacing) is in the center

The logo's wide width causes it to overlap with the side elements, especially on smaller mobile screens.

## The Solution

### 1. Adjust Header Layout for Mobile
**File: `src/components/Header.tsx`**

Change the header layout so elements don't overlap:
- Keep the logo centered but give it proper space boundaries
- Use flexbox with `flex-1` sections so elements respect each other's space
- Reduce logo size on mobile to fit within available space

### 2. Make Logo Responsive  
**File: `src/components/Logo.tsx`**

Adjust the logo sizing for mobile:
- Smaller text size on mobile (`text-xl` instead of `text-2xl`)
- Tighter letter-spacing on mobile
- Option to hide the subtitle on very small screens
- Add `text-center` to ensure proper centering

### 3. Header Structure Change
```text
Current:
┌──────────────────────────────────────────┐
│ [≡]  NINA ARMEND (absolute center)  [🛒] │
│       overlaps on small screens          │
└──────────────────────────────────────────┘

Fixed:
┌──────────────────────────────────────────┐
│ [≡]    |    NINA ARMEND    |        [🛒] │
│ flex-0 |      flex-1       |      flex-0 │
└──────────────────────────────────────────┘
```

## Technical Changes

### Header.tsx
- Replace `absolute left-1/2 -translate-x-1/2` logo positioning with flex-based layout
- Create three sections: left icons, center logo, right icons
- Each section respects boundaries of others
- Use `justify-center` for the middle section

### Logo.tsx  
- Add responsive text sizing: `text-lg sm:text-xl md:text-2xl lg:text-3xl`
- Reduce letter-spacing on mobile: `tracking-[0.15em] md:tracking-[0.3em]`
- Add `text-center` for proper alignment
- Optionally hide subtitle on very small screens with `hidden xs:block`

This approach maintains the centered luxury aesthetic while preventing any overlap on all screen sizes.

