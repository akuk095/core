# Design System Documentation

This design system provides a comprehensive set of reusable components based on the tracker page UI/UX patterns. All components use HSL/HSLA colors and follow glassmorphism design principles.

## Setup

Include the design system CSS in your HTML:

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="design-system.css">
```

## Color Palette

The design system uses CSS custom properties for theming:

```css
--accent-color: hsl(239, 84%, 67%)
--glass-bg: hsla(0, 0%, 100%, 0.6)
--glass-border: hsla(0, 0%, 100%, 0.8)
--text-primary: hsl(210, 22%, 23%)
--text-secondary: hsla(210, 22%, 23%, 0.7)
```

## 1. Page Layout Components

### Page Header
Standard header with back button, title, and menu button.

```html
<header class="page-header">
    <a href="index.html" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7"/>
        </svg>
    </a>
    <h2 class="page-title">Page Title</h2>
    <button class="menu-btn">
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 12h8M3 6h18M3 18h18" stroke="currentColor" stroke-width="2"/>
        </svg>
    </button>
</header>
```

### Title Section
Section with title and optional button.

```html
<div class="title-section">
    <h2 class="section-title">Section Title</h2>
    <button class="icon-btn">
        <svg>...</svg>
    </button>
</div>
```

## 2. Button Components

### Icon Button
Small button with icon, used in headers and cards.

```html
<button class="icon-btn">
    <svg viewBox="0 0 24 24">...</svg>
</button>
```

### Floating Action Button (FAB)
Centered floating button above bottom nav.

```html
<button class="fab">+</button>
```

### Primary Button
Main action button with accent color.

```html
<button class="btn-primary">Save Changes</button>
```

### Secondary Button
Secondary action button with transparent background.

```html
<button class="btn-secondary">Cancel</button>
```

### Ghost Button
Minimal button with no background.

```html
<button class="btn-ghost">Learn More</button>
```

## 3. Card Components

### Base Card
Standard glassmorphism card.

```html
<div class="card">
    <div class="card-header">
        <svg class="card-icon">...</svg>
        <span>Card Title</span>
    </div>
    <div class="card-body">
        <p>Card content goes here</p>
    </div>
</div>
```

### Interactive Card
Card with hover effects and cursor pointer.

```html
<div class="card card-interactive">
    <!-- Card content -->
</div>
```

## 4. Grid Layouts

### Masonry Grid
Pinterest-style two-column layout for cards.

```html
<div class="masonry-grid">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</div>
```

### Two Column Grid
Equal-width two-column grid.

```html
<div class="grid-2col">
    <div class="card">Column 1</div>
    <div class="card">Column 2</div>
</div>
```

### Three Column Grid
Equal-width three-column grid.

```html
<div class="grid-3col">
    <div class="card">Column 1</div>
    <div class="card">Column 2</div>
    <div class="card">Column 3</div>
</div>
```

### List Layout
Vertical list with consistent spacing.

```html
<div class="list-layout">
    <div class="card">Item 1</div>
    <div class="card">Item 2</div>
    <div class="card">Item 3</div>
</div>
```

## 5. Tabs & Navigation

### Tab Buttons
Horizontal tab navigation.

```html
<div class="tabs">
    <button class="tab active">Daily</button>
    <button class="tab">Weekly</button>
    <button class="tab">Monthly</button>
    <button class="tab">Yearly</button>
</div>
```

### Scroll Navigation
Horizontally scrollable navigation.

```html
<nav class="scroll-nav">
    <a href="#" class="scroll-nav-item active">All</a>
    <a href="#" class="scroll-nav-item">Health</a>
    <a href="#" class="scroll-nav-item">Fitness</a>
    <a href="#" class="scroll-nav-item">Mind</a>
</nav>
```

## 6. Form Elements

### Text Input

```html
<input type="text" class="input" placeholder="Enter text...">
```

### Textarea

```html
<textarea class="textarea" placeholder="Enter description..."></textarea>
```

### Select Dropdown

```html
<select class="select">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
</select>
```

### Toggle Switch

```html
<label class="toggle">
    <input type="checkbox">
    <span class="toggle-slider"></span>
</label>
```

## 7. Typography Utilities

### Text Sizes

```html
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p class="text-base">Base text (default)</p>
<p class="text-lg">Large text</p>
<p class="text-xl">Extra large text</p>
<p class="text-2xl">2X large text</p>
```

### Text Weights

```html
<p class="font-normal">Normal weight (400)</p>
<p class="font-medium">Medium weight (500)</p>
<p class="font-semibold">Semibold weight (600)</p>
<p class="font-bold">Bold weight (700)</p>
```

### Text Colors

```html
<p class="text-primary">Primary text color</p>
<p class="text-secondary">Secondary text color</p>
<p class="text-muted">Muted text color</p>
<p class="text-accent">Accent color</p>
```

## 8. Spacing Utilities

### Margins

```html
<div class="m-0">No margin</div>
<div class="m-1">8px margin</div>
<div class="m-2">12px margin</div>
<div class="m-3">16px margin</div>
<div class="m-4">20px margin</div>
<div class="m-5">24px margin</div>
<div class="m-6">32px margin</div>

<!-- Individual sides -->
<div class="mt-4">Top margin 20px</div>
<div class="mb-4">Bottom margin 20px</div>
<div class="ml-4">Left margin 20px</div>
<div class="mr-4">Right margin 20px</div>
```

### Padding

```html
<div class="p-0">No padding</div>
<div class="p-1">8px padding</div>
<div class="p-2">12px padding</div>
<div class="p-3">16px padding</div>
<div class="p-4">20px padding</div>
<div class="p-5">24px padding</div>
<div class="p-6">32px padding</div>

<!-- Individual sides -->
<div class="pt-4">Top padding 20px</div>
<div class="pb-4">Bottom padding 20px</div>
<div class="pl-4">Left padding 20px</div>
<div class="pr-4">Right padding 20px</div>
```

### Gap (for flex/grid)

```html
<div class="flex gap-1">8px gap</div>
<div class="flex gap-2">12px gap</div>
<div class="flex gap-3">16px gap</div>
<div class="flex gap-4">20px gap</div>
```

## 9. Layout Utilities

### Flexbox

```html
<div class="flex">Basic flex container</div>
<div class="flex-col">Flex column</div>
<div class="flex-center">Center items</div>
<div class="flex-between">Space between</div>
<div class="flex-around">Space around</div>
<div class="flex-wrap">Allow wrapping</div>
```

### Alignment

```html
<div class="items-center">Vertical center</div>
<div class="items-start">Vertical start</div>
<div class="items-end">Vertical end</div>
<div class="justify-center">Horizontal center</div>
<div class="justify-start">Horizontal start</div>
<div class="justify-end">Horizontal end</div>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
```

## 10. Progress & Status Components

### Progress Ring
Circular progress indicator.

```html
<div class="progress-container">
    <svg class="progress-ring" width="120" height="120">
        <circle class="progress-ring-bg" cx="60" cy="60" r="52" stroke-width="8" fill="none"/>
        <circle class="progress-ring-fill" cx="60" cy="60" r="52" stroke-width="8" fill="none"
                stroke-dasharray="327" stroke-dashoffset="81.75"/>
    </svg>
    <div class="progress-text">
        <div class="progress-value">345</div>
        <div class="progress-label">Kcal</div>
    </div>
</div>
```

### Progress Bar
Linear progress bar.

```html
<div class="progress-bar">
    <div class="progress-bar-fill" style="width: 75%"></div>
</div>
```

### Status Badge

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-info">Info</span>
```

## 11. Modal & Overlay Components

### Modal

```html
<div class="modal">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>Modal Title</h3>
            <button class="icon-btn">×</button>
        </div>
        <div class="modal-body">
            <p>Modal content goes here</p>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary">Cancel</button>
            <button class="btn-primary">Confirm</button>
        </div>
    </div>
</div>
```

## 12. Empty States

### Empty State

```html
<div class="empty-state">
    <svg class="empty-state-icon">...</svg>
    <h3 class="empty-state-title">No Items Found</h3>
    <p class="empty-state-text">Get started by adding your first item</p>
    <button class="btn-primary">Add Item</button>
</div>
```

## 13. Loading States

### Skeleton Loader

```html
<div class="skeleton">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
</div>
```

### Spinner

```html
<div class="spinner"></div>
```

## 14. Responsive Utilities

### Breakpoints

```css
/* Mobile First - Base styles apply to mobile */
/* Tablet: 768px and up */
/* Desktop: 1024px and up */
```

### Hidden/Visible

```html
<div class="hide-mobile">Hidden on mobile</div>
<div class="hide-tablet">Hidden on tablet</div>
<div class="hide-desktop">Hidden on desktop</div>
<div class="show-mobile">Visible only on mobile</div>
<div class="show-tablet">Visible only on tablet</div>
<div class="show-desktop">Visible only on desktop</div>
```

## 15. Animation Utilities

### Fade In

```html
<div class="fade-in">Fades in on load</div>
```

### Slide Up

```html
<div class="slide-up">Slides up on load</div>
```

### Scale In

```html
<div class="scale-in">Scales in on load</div>
```

## 16. Accessibility

### Focus Styles
All interactive elements have custom focus styles for keyboard navigation.

### Screen Reader Only

```html
<span class="sr-only">This text is only visible to screen readers</span>
```

## Best Practices

1. **Use semantic HTML**: Always use appropriate HTML5 semantic elements
2. **Combine utilities**: Mix and match utility classes for custom layouts
3. **Maintain consistency**: Stick to the 8px spacing scale (8, 12, 16, 20, 24, 32)
4. **Test responsiveness**: Check layouts on mobile, tablet, and desktop
5. **Use HSL colors**: All custom colors should use HSL/HSLA format
6. **Follow glassmorphism**: Cards should use backdrop-filter and semi-transparent backgrounds

## Example Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="design-system.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="page-header">
            <a href="index.html" class="back-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 19l-7-7 7-7"/>
                </svg>
            </a>
            <h2 class="page-title">Page Title</h2>
            <button class="menu-btn">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h8M3 6h18M3 18h18" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </header>

        <!-- Content -->
        <div class="masonry-grid">
            <div class="card card-interactive">
                <div class="card-header">
                    <svg class="card-icon">...</svg>
                    <span>Card Title</span>
                </div>
                <div class="card-body">
                    <p>Card content</p>
                </div>
            </div>
        </div>

        <!-- FAB -->
        <button class="fab">+</button>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav glass-tile">
            <!-- Nav items -->
        </nav>
    </div>
</body>
</html>
```
