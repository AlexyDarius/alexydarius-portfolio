#!/usr/bin/env node

/**
 * Color Sync Utility
 * 
 * This script automatically syncs custom colors from config.js to scheme.scss
 * Run with: node scripts/sync-colors.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const configPath = path.join(__dirname, '../src/app/resources/config.js');
const schemePath = path.join(__dirname, '../src/once-ui/tokens/scheme.scss');

function extractCustomColors() {
  try {
    // Read config file
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Extract customColors object using regex
    const customColorsMatch = configContent.match(/const customColors = ({[\s\S]*?});/);
    if (!customColorsMatch) {
      console.log('❌ No customColors found in config.js');
      return null;
    }
    
    // Parse the customColors object
    const customColorsStr = customColorsMatch[1];
    const customColors = eval(`(${customColorsStr})`);
    
    return customColors;
  } catch (error) {
    console.error('❌ Error reading config.js:', error.message);
    return null;
  }
}

function generateCSSVariables(colors, colorType) {
  let css = `    /* custom ${colorType} */\n`;
  
  // Generate main color variables
  for (let i = 100; i <= 1200; i += 100) {
    if (colors[i]) {
      css += `    --scheme-${colorType}-${i}:  ${colors[i]};\n`;
    }
  }
  
  css += '\n';
  
  // Generate alpha variants
  if (colors['600-10']) css += `    --scheme-${colorType}-600-10: ${colors['600-10']};\n`;
  if (colors['600-30']) css += `    --scheme-${colorType}-600-30: ${colors['600-30']};\n`;
  if (colors['600-50']) css += `    --scheme-${colorType}-600-50: ${colors['600-50']};\n`;
  
  return css;
}

function updateSchemeFile(customColors) {
  try {
    // Read current scheme file
    let schemeContent = fs.readFileSync(schemePath, 'utf8');
    
    // Generate new CSS for each color type
    let newCustomCSS = '';
    if (customColors.brand) {
      newCustomCSS += generateCSSVariables(customColors.brand, 'brand') + '\n';
    }
    if (customColors.accent) {
      newCustomCSS += generateCSSVariables(customColors.accent, 'accent') + '\n';
    }
    if (customColors.neutral) {
      newCustomCSS += generateCSSVariables(customColors.neutral, 'neutral');
    }
    
    // Replace the custom section
    const customSectionRegex = /(\/\* CUSTOM \*\/[\s\S]*?\/\*[\s\S]*?\*\/)([\s\S]*?)(\/\* BASE \*\/)/;
    const replacement = `/* CUSTOM */
    /* 
        Custom color palette - automatically generated from config.js
        You can also generate palettes at https://once-ui.com/customize
    */
    
${newCustomCSS}
    /* BASE */`;
    
    const updatedContent = schemeContent.replace(customSectionRegex, replacement);
    
    // Write back to file
    fs.writeFileSync(schemePath, updatedContent, 'utf8');
    
    console.log('✅ Successfully synced custom colors to scheme.scss');
    return true;
  } catch (error) {
    console.error('❌ Error updating scheme.scss:', error.message);
    return false;
  }
}

function main() {
  console.log('🎨 Syncing custom colors from config.js to scheme.scss...\n');
  
  // Extract colors from config
  const customColors = extractCustomColors();
  if (!customColors) {
    return;
  }
  
  console.log('📋 Found custom colors for:', Object.keys(customColors).join(', '));
  
  // Update scheme file
  const success = updateSchemeFile(customColors);
  
  if (success) {
    console.log('\n🎉 Color sync complete! Your custom palette is now active.');
    console.log('💡 Tip: Run "npm run build" to see your changes.');
  }
}

// Run the script
main(); 