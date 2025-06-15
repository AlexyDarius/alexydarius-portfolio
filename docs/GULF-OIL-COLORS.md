# 🏁 Gulf Oil Inspired Color Palette

Your portfolio now uses a custom color palette inspired by the iconic Gulf Oil branding, featuring their signature light blue and orange colors.

## 🎨 Color Overview

### **Brand Colors (Gulf Blue)**
- **Primary**: `#6AC5F4` - Gulf Light Blue (600)
- **Range**: Dark blue-grays to light blues
- **Usage**: Main brand elements, buttons, links, highlights

### **Accent Colors (Gulf Orange)**  
- **Primary**: `#FF7403` - Gulf Orange (600)
- **Range**: Dark orange-browns to light oranges
- **Usage**: Call-to-action elements, accents, highlights

### **Neutral Colors (Clean Grays)**
- **Primary**: `#787878` - Clean Gray (600)
- **Range**: Dark grays to near-white
- **Usage**: Text, backgrounds, borders, subtle elements

## 🏁 Gulf Oil Brand Heritage

The colors are based on the legendary Gulf Oil racing livery:
- **Light Blue**: `#6AC5F4` - The iconic Gulf racing blue
- **Orange**: `#FF7403` - The vibrant Gulf racing orange
- **Clean Aesthetic**: Inspired by Gulf's timeless, professional design

## 🚀 How It Works

### **Current Configuration**
```javascript
// In src/app/resources/config.js
const style = {
  brand: "custom",    // Uses Gulf Blue palette
  accent: "custom",   // Uses Gulf Orange palette  
  neutral: "custom",  // Uses clean gray palette
};
```

### **Color Usage Examples**
```jsx
// Brand elements use Gulf Blue
<Button variant="brand">Gulf Blue Button</Button>
<Text onBackground="brand-strong">Gulf Blue Text</Text>

// Accent elements use Gulf Orange
<Tag variant="accent">Gulf Orange Tag</Tag>
<Button variant="accent">Gulf Orange CTA</Button>

// Neutral elements use clean grays
<Flex background="neutral-weak">Clean Background</Flex>
<Text onBackground="neutral-medium">Gray Text</Text>
```

## 🎯 Color Scale Breakdown

### **Gulf Blue (Brand) - 12 Steps**
```
100: #0A1419  // Very dark blue-gray (dark mode backgrounds)
200: #142832  // Dark blue-gray
300: #1E3C4B  // Medium dark blue
400: #285064  // Medium blue
500: #32647D  // Medium light blue
600: #6AC5F4  // Gulf Light Blue ⭐ PRIMARY
700: #87D1F6  // Lighter blue
800: #A4DDF8  // Very light blue
900: #C1E9FA  // Pale blue
1000: #DEF5FC // Very pale blue
1100: #EEFAFD // Near white blue
1200: #F7FCFE // Almost white (light mode backgrounds)
```

### **Gulf Orange (Accent) - 12 Steps**
```
100: #1A0C02  // Very dark orange-brown
200: #331804  // Dark orange-brown
300: #4D2406  // Medium dark orange
400: #663008  // Medium orange-brown
500: #B85A06  // Medium orange
600: #FF7403  // Gulf Orange ⭐ PRIMARY
700: #FF8F33  // Lighter orange
800: #FFAA63  // Light orange
900: #FFC593  // Pale orange
1000: #FFE0C3 // Very pale orange
1100: #FFF0E1 // Near white orange
1200: #FFF8F0 // Almost white
```

## 🔧 Customization

### **To Modify Colors**
1. Edit `src/app/resources/config.js`
2. Update the `customColors` object
3. Run `npm run sync-colors`
4. Build: `npm run build`

### **To Switch Back to Predefined Colors**
```javascript
const style = {
  brand: "cyan",      // or any predefined color
  accent: "orange",   // or any predefined color
  neutral: "gray",    // sand | gray | slate
};
```

## 🏆 Racing Heritage

This color scheme pays homage to:
- **Gulf Racing Team** (1960s-1970s)
- **Ford GT40** Gulf livery
- **Porsche 917** Gulf racing cars
- **Le Mans** racing heritage
- **Steve McQueen's "Le Mans"** film

The Gulf Oil colors represent speed, precision, and timeless design - perfect for a professional portfolio with a touch of racing heritage.

---

**Ready to race?** Your portfolio now sports the legendary Gulf Oil colors! 🏁 