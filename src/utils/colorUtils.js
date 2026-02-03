/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h, s, l };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * Generate gradient colors between start and end colors
 */
export function generateGradient(startColor, endColor, steps) {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  
  if (!start || !end) return [];

  const startHsl = rgbToHsl(start.r, start.g, start.b);
  const endHsl = rgbToHsl(end.r, end.g, end.b);

  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    
    // Interpolate HSL values
    let h = startHsl.h + (endHsl.h - startHsl.h) * ratio;
    const s = startHsl.s + (endHsl.s - startHsl.s) * ratio;
    const l = startHsl.l + (endHsl.l - startHsl.l) * ratio;

    // Handle hue wrapping for shorter path
    const hueDiff = endHsl.h - startHsl.h;
    if (Math.abs(hueDiff) > 0.5) {
      if (hueDiff > 0) {
        h = startHsl.h + (hueDiff - 1) * ratio;
      } else {
        h = startHsl.h + (hueDiff + 1) * ratio;
      }
    }

    // Normalize hue
    if (h < 0) h += 1;
    if (h > 1) h -= 1;

    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  return colors;
}

/**
 * Generate random hex color
 */
export function getRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
