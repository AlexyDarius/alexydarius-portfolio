# 🎨 Custom Color Palette System

This guide explains how to add your own custom color palettes to your Once UI portfolio, going beyond the predefined color options.

## 📋 Overview

By default, Once UI provides predefined color options like `"cyan"`, `"blue"`, `"emerald"`, etc. This system allows you to define completely custom color palettes with full control over every shade.

## 🚀 Quick Start

### 1. Enable Custom Colors

In `src/app/resources/config.js`, set your theme colors to `"custom"`:

```javascript
const style = {
  theme: "dark",
  neutral: "custom",  // Instead of "gray", "sand", "slate"
  brand: "custom",    // Instead of "cyan", "blue", etc.
  accent: "custom",   // Instead of "emerald", "violet", etc.
  // ... other settings
};
```

### 2. Define Your Custom Palette

Add your custom colors in the same config file:

```javascript
const customColors = {
  brand: {
    // 12-step color scale (darkest to lightest)
    100: "#0A0A0A",   // Darkest
    200: "#151515",
    300: "#3F3F3F", 
    400: "#595959",
    500: "#757575",
    600: "#959595",   // Primary brand color (most important)
    700: "#B2B2B2",
    800: "#D2D2D2",
    900: "#E0E0E0",
    1000: "#EDEDED",
    1100: "#F3F3F3",
    1200: "#F9F9F9",  // Lightest
    
    // Alpha variants of the primary color (600)
    "600-10": "#95959519", // 10% opacity
    "600-30": "#9595954D", // 30% opacity  
    "600-50": "#95959580", // 50% opacity
  },
  accent: {
    // Your accent color palette...
  },
  neutral: {
    // Your neutral color palette...
  }
};
```

### 3. Sync Colors

Run the sync command to apply your colors:

```bash
npm run sync-colors
```

### 4. Build and See Changes

```bash
npm run build
npm run dev
```

## 🎯 Color Scale Explained

### The 12-Step Scale

Each color type (brand, accent, neutral) uses a 12-step scale:

- **100-300**: Dark shades (backgrounds in dark mode, text in light mode)
- **400-600**: Mid-range shades (borders, secondary elements)
- **700-900**: Light shades (text in dark mode, backgrounds in light mode)
- **1000-1200**: Very light shades (subtle backgrounds, borders)

### Key Colors

- **600**: Primary color - most important, used for main brand elements
- **100**: Darkest shade - used for text on light backgrounds
- **1200**: Lightest shade - used for subtle backgrounds

### Alpha Variants

Alpha variants of the 600 color provide transparency options:
- `600-10`: 10% opacity (subtle overlays)
- `600-30`: 30% opacity (hover states)
- `600-50`: 50% opacity (disabled states)

## 🛠️ Advanced Usage

### Generating Color Palettes

1. **Once UI Generator**: Visit [once-ui.com/customize](https://once-ui.com/customize)
2. **Manual Creation**: Use tools like [Coolors.co](https://coolors.co) or [Adobe Color](https://color.adobe.com)
3. **Programmatic**: Use libraries like `chroma-js` to generate scales

### Color Palette Tips

1. **Consistent Lightness Steps**: Each step should have a noticeable but not jarring difference
2. **Accessibility**: Ensure sufficient contrast ratios (4.5:1 for normal text, 3:1 for large text)
3. **Brand Alignment**: Your 600 color should be your primary brand color
4. **Test Both Themes**: Colors work differently in light vs dark mode

### Example: Creating a Purple Brand Palette

```javascript
const customColors = {
  brand: {
    100: "#1A0B2E",   // Very dark purple
    200: "#2D1B4E",   // Dark purple
    300: "#4C2A85",   // Medium dark purple
    400: "#6B3AA0",   // Medium purple
    500: "#8B4FBF",   // Medium light purple
    600: "#A855F7",   // Primary purple (Tailwind purple-500)
    700: "#C084FC",   // Light purple
    800: "#DDD6FE",   // Very light purple
    900: "#EDE9FE",   // Pale purple
    1000: "#F3F4F6",  // Near white with purple tint
    1100: "#F9FAFB",  // Very pale purple
    1200: "#FFFFFF",  // White
    
    "600-10": "#A855F71A", // 10% purple
    "600-30": "#A855F74D", // 30% purple
    "600-50": "#A855F780", // 50% purple
  }
};
```

## 🔧 Troubleshooting

### Colors Not Updating?

1. **Run sync command**: `npm run sync-colors`
2. **Clear cache**: Delete `.next` folder and rebuild
3. **Check syntax**: Ensure all hex codes are valid
4. **Restart dev server**: Stop and restart `npm run dev`

### Colors Look Wrong?

1. **Check contrast**: Use browser dev tools to test contrast ratios
2. **Test both themes**: Switch between light and dark mode
3. **Verify alpha values**: Ensure alpha variants use correct opacity format

### Build Errors?

1. **Validate hex codes**: All colors must be valid hex codes
2. **Check commas**: Ensure proper JavaScript object syntax
3. **Run TypeScript check**: `npx tsc --noEmit`

## 📁 File Structure

```
src/
├── app/resources/config.js          # Your custom color definitions
├── once-ui/tokens/scheme.scss       # Generated CSS variables
└── once-ui/tokens/function.scss     # Color mapping logic

scripts/
└── sync-colors.js                   # Sync utility

docs/
└── CUSTOM-COLORS.md                 # This documentation
```

## 🎨 Color Usage in Components

Once your custom colors are set up, they work exactly like the predefined colors:

```jsx
// These will use your custom brand colors
<Button variant="brand">Click me</Button>
<Text onBackground="brand-strong">Brand text</Text>

// These will use your custom accent colors  
<Tag variant="accent">Accent tag</Tag>

// These will use your custom neutral colors
<Flex background="neutral-weak">Content</Flex>
```

## 🚀 Next Steps

1. **Experiment**: Try different color combinations
2. **Test accessibility**: Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
3. **Create variations**: Make seasonal or themed color palettes
4. **Share**: Export your `customColors` object to share with others

---

**Need help?** Check the [Once UI documentation](https://once-ui.com/docs) or create an issue in your repository. 