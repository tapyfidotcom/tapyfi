export interface GradientPreset {
  id: number;
  name: string;
  cssCode: string;
  colors: string[];
  gradientType: 'linear' | 'radial';
  gradientDirection?: number;
  category: 'Warm' | 'Cool' | 'Nature' | 'Sunset' | 'Ocean' | 'Modern' | 'Classic';
}

// Helper function to extract colors from CSS gradient
const extractColorsFromCSS = (cssCode: string): string[] => {
  const colorRegex = /#[a-fA-F0-9]{3,6}/g;
  return cssCode.match(colorRegex) || [];
};

// Helper function to categorize gradients
const categorizeGradient = (name: string): GradientPreset['category'] => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('warm') || lowerName.includes('fire') || lowerName.includes('sunset') || lowerName.includes('orange') || lowerName.includes('red') || lowerName.includes('flame') || lowerName.includes('passion')) return 'Warm';
  if (lowerName.includes('cool') || lowerName.includes('blue') || lowerName.includes('ice') || lowerName.includes('winter') || lowerName.includes('frozen') || lowerName.includes('night')) return 'Cool';
  if (lowerName.includes('nature') || lowerName.includes('green') || lowerName.includes('forest') || lowerName.includes('grass') || lowerName.includes('spring') || lowerName.includes('life')) return 'Nature';
  if (lowerName.includes('sunset') || lowerName.includes('sunrise') || lowerName.includes('golden') || lowerName.includes('morning') || lowerName.includes('sun')) return 'Sunset';
  if (lowerName.includes('ocean') || lowerName.includes('sea') || lowerName.includes('aqua') || lowerName.includes('water') || lowerName.includes('beach') || lowerName.includes('river')) return 'Ocean';
  if (lowerName.includes('modern') || lowerName.includes('tech') || lowerName.includes('neon') || lowerName.includes('party') || lowerName.includes('space')) return 'Modern';
  return 'Classic';
};

export const gradientPresets: GradientPreset[] = [
  {
    id: 1,
    name: "Warm Flame",
    cssCode: "background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
    colors: ["#ff9a9e", "#fad0c4"],
    gradientType: "linear",
    gradientDirection: 45,
    category: "Warm"
  },
  {
    id: 2,
    name: "Night Fade",
    cssCode: "background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);",
    colors: ["#a18cd1", "#fbc2eb"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 3,
    name: "Spring Warmth",
    cssCode: "background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);",
    colors: ["#fad0c4", "#ffd1ff"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 4,
    name: "Juicy Peach",
    cssCode: "background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);",
    colors: ["#ffecd2", "#fcb69f"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 5,
    name: "Young Passion",
    cssCode: "background-image: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);",
    colors: ["#ff8177", "#ff867a", "#ff8c7f", "#f99185", "#cf556c", "#b12a5b"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 6,
    name: "Lady Lips",
    cssCode: "background-image: linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);",
    colors: ["#ff9a9e", "#fecfef"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 7,
    name: "Sunny Morning",
    cssCode: "background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);",
    colors: ["#f6d365", "#fda085"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Sunset"
  },
  {
    id: 8,
    name: "Rainy Ashville",
    cssCode: "background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);",
    colors: ["#fbc2eb", "#a6c1ee"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 9,
    name: "Frozen Dreams",
    cssCode: "background-image: linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);",
    colors: ["#fdcbf1", "#e6dee9"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 10,
    name: "Winter Neva",
    cssCode: "background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
    colors: ["#a1c4fd", "#c2e9fb"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Cool"
  },
  {
    id: 11,
    name: "Dusty Grass",
    cssCode: "background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);",
    colors: ["#d4fc79", "#96e6a1"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Nature"
  },
  {
    id: 12,
    name: "Tempting Azure",
    cssCode: "background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
    colors: ["#84fab0", "#8fd3f4"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Ocean"
  },
  {
    id: 13,
    name: "Heavy Rain",
    cssCode: "background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);",
    colors: ["#cfd9df", "#e2ebf0"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 14,
    name: "Amy Crisp",
    cssCode: "background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);",
    colors: ["#a6c0fe", "#f68084"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Modern"
  },
  {
    id: 15,
    name: "Mean Fruit",
    cssCode: "background-image: linear-gradient(120deg, #fccb90 0%, #d57eeb 100%);",
    colors: ["#fccb90", "#d57eeb"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Modern"
  },
  {
    id: 16,
    name: "Deep Blue",
    cssCode: "background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);",
    colors: ["#e0c3fc", "#8ec5fc"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Ocean"
  },
  {
    id: 17,
    name: "Ripe Malinka",
    cssCode: "background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);",
    colors: ["#f093fb", "#f5576c"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Warm"
  },
  {
    id: 18,
    name: "Cloudy Knoxville",
    cssCode: "background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);",
    colors: ["#fdfbfb", "#ebedee"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Classic"
  },
  {
    id: 19,
    name: "Malibu Beach",
    cssCode: "background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);",
    colors: ["#4facfe", "#00f2fe"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Ocean"
  },
  {
    id: 20,
    name: "New Life",
    cssCode: "background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);",
    colors: ["#43e97b", "#38f9d7"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Nature"
  },
  {
    id: 21,
    name: "True Sunset",
    cssCode: "background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);",
    colors: ["#fa709a", "#fee140"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Sunset"
  },
  {
    id: 22,
    name: "Morpheus Den",
    cssCode: "background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);",
    colors: ["#30cfd0", "#330867"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 23,
    name: "Rare Wind",
    cssCode: "background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);",
    colors: ["#a8edea", "#fed6e3"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 24,
    name: "Near Moon",
    cssCode: "background-image: linear-gradient(to top, #5ee7df 0%, #b490ca 100%);",
    colors: ["#5ee7df", "#b490ca"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 25,
    name: "Wild Apple",
    cssCode: "background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);",
    colors: ["#d299c2", "#fef9d7"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 26,
    name: "Saint Petersburg",
    cssCode: "background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);",
    colors: ["#f5f7fa", "#c3cfe2"],
    gradientType: "linear",
    gradientDirection: 135,
    category: "Classic"
  },
  {
    id: 27,
    name: "Arielle's Smile",
    cssCode: "background-image: radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%);",
    colors: ["#16d9e3", "#30c7ec", "#46aef7"],
    gradientType: "radial",
    category: "Ocean"
  },
  {
    id: 28,
    name: "Plum Plate",
    cssCode: "background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
    colors: ["#667eea", "#764ba2"],
    gradientType: "linear",
    gradientDirection: 135,
    category: "Modern"
  },
  {
    id: 29,
    name: "Everlasting Sky",
    cssCode: "background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);",
    colors: ["#fdfcfb", "#e2d1c3"],
    gradientType: "linear",
    gradientDirection: 135,
    category: "Classic"
  },
  {
    id: 30,
    name: "Happy Fisher",
    cssCode: "background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);",
    colors: ["#89f7fe", "#66a6ff"],
    gradientType: "linear",
    gradientDirection: 120,
    category: "Ocean"
  },
  {
    id: 31,
    name: "Blessing",
    cssCode: "background-image: linear-gradient(to top, #fddb92 0%, #d1fdff 100%);",
    colors: ["#fddb92", "#d1fdff"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Sunset"
  },
  {
    id: 32,
    name: "Sharpeye Eagle",
    cssCode: "background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%);",
    colors: ["#9890e3", "#b1f4cf"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 33,
    name: "Ladoga Bottom",
    cssCode: "background-image: linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%);",
    colors: ["#ebc0fd", "#d9ded8"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 34,
    name: "Lemon Gate",
    cssCode: "background-image: linear-gradient(to top, #96fbc4 0%, #f9f586 100%);",
    colors: ["#96fbc4", "#f9f586"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 35,
    name: "Itmeo Branding",
    cssCode: "background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);",
    colors: ["#2af598", "#009efd"],
    gradientType: "linear",
    gradientDirection: 180,
    category: "Modern"
  },
  {
    id: 36,
    name: "Zeus Miracle",
    cssCode: "background-image: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);",
    colors: ["#cd9cf2", "#f6f3ff"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 37,
    name: "Old Hat",
    cssCode: "background-image: linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%);",
    colors: ["#e4afcb", "#b8cbb8", "#e2c58b", "#c2ce9c", "#7edbdc"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Classic"
  },
  {
    id: 38,
    name: "Star Wine",
    cssCode: "background-image: linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%);",
    colors: ["#b8cbb8", "#b465da", "#cf6cc9", "#ee609c"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 39,
    name: "Deep Blue",
    cssCode: "background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);",
    colors: ["#6a11cb", "#2575fc"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Cool"
  },
  {
    id: 40,
    name: "Coup de Grace",
    cssCode: "background-color: #DCD9D4; background-image: linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%); background-blend-mode: soft-light,screen;",
    colors: ["#DCD9D4"],
    gradientType: "linear",
    gradientDirection: 180,
    category: "Classic"
  },
  {
    id: 41,
    name: "Happy Acid",
    cssCode: "background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%);",
    colors: ["#37ecba", "#72afd3"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 42,
    name: "Awesome Pine",
    cssCode: "background-image: linear-gradient(to top, #ebbba7 0%, #cfc7f8 100%);",
    colors: ["#ebbba7", "#cfc7f8"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 43,
    name: "New York",
    cssCode: "background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
    colors: ["#fff1eb", "#ace0f9"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 44,
    name: "Shy Rainbow",
    cssCode: "background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);",
    colors: ["#eea2a2", "#bbc1bf", "#57c6e1", "#b49fda", "#7ac5d8"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Modern"
  },
  {
    id: 45,
    name: "Loon Crest",
    cssCode: "background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898; background-blend-mode: multiply,multiply;",
    colors: ["#989898"],
    gradientType: "linear",
    gradientDirection: 180,
    category: "Classic"
  },
  {
    id: 46,
    name: "Mixed Hopes",
    cssCode: "background-image: linear-gradient(to top, #c471f5 0%, #fa71cd 100%);",
    colors: ["#c471f5", "#fa71cd"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 47,
    name: "Fly High",
    cssCode: "background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);",
    colors: ["#48c6ef", "#6f86d6"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 48,
    name: "Strong Bliss",
    cssCode: "background-image: linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%);",
    colors: ["#f78ca0", "#f9748f", "#fd868c", "#fe9a8b"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 49,
    name: "Fresh Milk",
    cssCode: "background-image: linear-gradient(to top, #feada6 0%, #f5efef 100%);",
    colors: ["#feada6", "#f5efef"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 50,
    name: "Snow Again",
    cssCode: "background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);",
    colors: ["#e6e9f0", "#eef1f5"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 51,
    name: "February Ink",
    cssCode: "background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);",
    colors: ["#accbee", "#e7f0fd"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 52,
    name: "Kind Steel",
    cssCode: "background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);",
    colors: ["#e9defa", "#fbfcdb"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Classic"
  },
  {
    id: 53,
    name: "Soft Grass",
    cssCode: "background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);",
    colors: ["#c1dfc4", "#deecdd"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 54,
    name: "Grown Early",
    cssCode: "background-image: linear-gradient(to top, #0ba360 0%, #3cba92 100%);",
    colors: ["#0ba360", "#3cba92"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 55,
    name: "Sharp Blues",
    cssCode: "background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);",
    colors: ["#00c6fb", "#005bea"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 56,
    name: "Shady Water",
    cssCode: "background-image: linear-gradient(to right, #74ebd5 0%, #9face6 100%);",
    colors: ["#74ebd5", "#9face6"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Ocean"
  },
  {
    id: 57,
    name: "Dirty Beauty",
    cssCode: "background-image: linear-gradient(to top, #6a85b6 0%, #bac8e0 100%);",
    colors: ["#6a85b6", "#bac8e0"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 58,
    name: "Great Whale",
    cssCode: "background-image: linear-gradient(to top, #a3bded 0%, #6991c7 100%);",
    colors: ["#a3bded", "#6991c7"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 59,
    name: "Teen Notebook",
    cssCode: "background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);",
    colors: ["#9795f0", "#fbc8d4"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 60,
    name: "Polite Rumors",
    cssCode: "background-image: linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%);",
    colors: ["#a7a6cb", "#8989ba"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 61,
    name: "Sweet Period",
    cssCode: "background-image: linear-gradient(to top, #3f51b1 0%, #5a55ae 13%, #7b5fac 25%, #8f6aae 38%, #a86aa4 50%, #cc6b8e 62%, #f18271 75%, #f3a469 87%, #f7c978 100%);",
    colors: ["#3f51b1", "#5a55ae", "#7b5fac", "#8f6aae", "#a86aa4", "#cc6b8e", "#f18271", "#f3a469", "#f7c978"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 62,
    name: "Wide Matrix",
    cssCode: "background-image: linear-gradient(to top, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%);",
    colors: ["#fcc5e4", "#fda34b", "#ff7882", "#c8699e", "#7046aa", "#0c1db8", "#020f75"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 63,
    name: "Soft Cherish",
    cssCode: "background-image: linear-gradient(to top, #dbdcd7 0%, #dddcd7 24%, #e2c9cc 30%, #e7627d 46%, #b8235a 59%, #801357 71%, #3d1635 84%, #1c1a27 100%);",
    colors: ["#dbdcd7", "#dddcd7", "#e2c9cc", "#e7627d", "#b8235a", "#801357", "#3d1635", "#1c1a27"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 64,
    name: "Red Salvation",
    cssCode: "background-image: linear-gradient(to top, #f43b47 0%, #453a94 100%);",
    colors: ["#f43b47", "#453a94"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 65,
    name: "Burning Spring",
    cssCode: "background-image: linear-gradient(to top, #4fb576 0%, #44c489 30%, #28a9ae 46%, #28a2b7 59%, #4c7788 71%, #6c4f63 86%, #432c39 100%);",
    colors: ["#4fb576", "#44c489", "#28a9ae", "#28a2b7", "#4c7788", "#6c4f63", "#432c39"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 66,
    name: "Night Party",
    cssCode: "background-image: linear-gradient(to top, #0250c5 0%, #d43f8d 100%);",
    colors: ["#0250c5", "#d43f8d"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 67,
    name: "Sky Glider",
    cssCode: "background-image: linear-gradient(to top, #88d3ce 0%, #6e45e2 100%);",
    colors: ["#88d3ce", "#6e45e2"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 68,
    name: "Heaven Peach",
    cssCode: "background-image: linear-gradient(to top, #d9afd9 0%, #97d9e1 100%);",
    colors: ["#d9afd9", "#97d9e1"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 69,
    name: "Purple Division",
    cssCode: "background-image: linear-gradient(to top, #7028e4 0%, #e5b2ca 100%);",
    colors: ["#7028e4", "#e5b2ca"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 70,
    name: "Aqua Splash",
    cssCode: "background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);",
    colors: ["#13547a", "#80d0c7"],
    gradientType: "linear",
    gradientDirection: 15,
    category: "Ocean"
  },
  {
    id: 71,
    name: "Above Clouds",
    cssCode: "background-image: linear-gradient(to left, #BDBBBE 0%, #9D9EA3 100%), radial-gradient(88% 271%, rgba(255, 255, 255, 0.25) 0%, rgba(254, 254, 254, 0.25) 1%, rgba(0, 0, 0, 0.25) 100%), radial-gradient(50% 100%, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%); background-blend-mode: normal, lighten, soft-light;",
    colors: ["#BDBBBE", "#9D9EA3"],
    gradientType: "linear",
    gradientDirection: 270,
    category: "Cool"
  },
  {
    id: 72,
    name: "Spiky Naga",
    cssCode: "background-image: linear-gradient(to top, #505285 0%, #585e92 12%, #65689f 25%, #7474b0 37%, #7e7ebb 50%, #8389c7 62%, #9795d4 75%, #a2a1dc 87%, #b5aee4 100%);",
    colors: ["#505285", "#585e92", "#65689f", "#7474b0", "#7e7ebb", "#8389c7", "#9795d4", "#a2a1dc", "#b5aee4"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 73,
    name: "Love Kiss",
    cssCode: "background-image: linear-gradient(to top, #ff0844 0%, #ffb199 100%);",
    colors: ["#ff0844", "#ffb199"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 74,
    name: "Sharp Glass",
    cssCode: "background: #C9CCD3; background-image: linear-gradient(-180deg, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%); background-blend-mode: lighten;",
    colors: ["#C9CCD3"],
    gradientType: "linear",
    gradientDirection: -180,
    category: "Cool"
  },
  {
    id: 75,
    name: "Clean Mirror",
    cssCode: "background-image: linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%);",
    colors: ["#93a5cf", "#e4efe9"],
    gradientType: "linear",
    gradientDirection: 45,
    category: "Cool"
  },
  {
    id: 76,
    name: "Premium Dark",
    cssCode: "background-image: linear-gradient(to right, #434343 0%, black 100%);",
    colors: ["#434343"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Cool"
  },
  {
    id: 77,
    name: "Cold Evening",
    cssCode: "background-image: linear-gradient(to top, #0c3483 0%, #a2b6df 100%, #6b8cce 100%, #a2b6df 100%);",
    colors: ["#0c3483", "#a2b6df", "#6b8cce"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 78,
    name: "Cochiti Lake",
    cssCode: "background-image: linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%);",
    colors: ["#93a5cf", "#e4efe9"],
    gradientType: "linear",
    gradientDirection: 45,
    category: "Ocean"
  },
  {
    id: 79,
    name: "Summer Games",
    cssCode: "background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);",
    colors: ["#92fe9d", "#00c9ff"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Modern"
  },
  {
    id: 80,
    name: "Passionate Bed",
    cssCode: "background-image: linear-gradient(to right, #ff758c 0%, #ff7eb3 100%);",
    colors: ["#ff758c", "#ff7eb3"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 81,
    name: "Mountain Rock",
    cssCode: "background-image: linear-gradient(to right, #868f96 0%, #596164 100%);",
    colors: ["#868f96", "#596164"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Classic"
  },
  {
    id: 82,
    name: "Desert Hump",
    cssCode: "background-image: linear-gradient(to top, #c79081 0%, #dfa579 100%);",
    colors: ["#c79081", "#dfa579"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 83,
    name: "Jungle Day",
    cssCode: "background-image: linear-gradient(45deg, #8baaaa 0%, #ae8b9c 100%);",
    colors: ["#8baaaa", "#ae8b9c"],
    gradientType: "linear",
    gradientDirection: 45,
    category: "Nature"
  },
  {
    id: 84,
    name: "Phoenix Start",
    cssCode: "background-image: linear-gradient(to right, #f83600 0%, #f9d423 100%);",
    colors: ["#f83600", "#f9d423"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 85,
    name: "October Silence",
    cssCode: "background-image: linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%);",
    colors: ["#b721ff", "#21d4fd"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Modern"
  },
  {
    id: 86,
    name: "Faraway River",
    cssCode: "background-image: linear-gradient(-20deg, #6e45e2 0%, #88d3ce 100%);",
    colors: ["#6e45e2", "#88d3ce"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Ocean"
  },
  {
    id: 87,
    name: "Alchemist Lab",
    cssCode: "background-image: linear-gradient(-20deg, #d558c8 0%, #24d292 100%);",
    colors: ["#d558c8", "#24d292"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Modern"
  },
  {
    id: 88,
    name: "Over Sun",
    cssCode: "background-image: linear-gradient(60deg, #abecd6 0%, #fbed96 100%);",
    colors: ["#abecd6", "#fbed96"],
    gradientType: "linear",
    gradientDirection: 60,
    category: "Sunset"
  },
  {
    id: 89,
    name: "Premium White",
    cssCode: "background-image: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);",
    colors: ["#d5d4d0", "#eeeeec", "#efeeec", "#e9e9e7"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 90,
    name: "Mars Party",
    cssCode: "background-image: linear-gradient(to top, #5f72bd 0%, #9b23ea 100%);",
    colors: ["#5f72bd", "#9b23ea"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 91,
    name: "Eternal Constance",
    cssCode: "background-image: linear-gradient(to top, #09203f 0%, #537895 100%);",
    colors: ["#09203f", "#537895"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 92,
    name: "Japan Blush",
    cssCode: "background-image: linear-gradient(-20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%);",
    colors: ["#ddd6f3", "#faaca8"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Warm"
  },
  {
    id: 93,
    name: "Smiling Rain",
    cssCode: "background-image: linear-gradient(-20deg, #dcb0ed 0%, #99c99c 100%);",
    colors: ["#dcb0ed", "#99c99c"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Nature"
  },
  {
    id: 94,
    name: "Cloudy Apple",
    cssCode: "background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);",
    colors: ["#f3e7e9", "#e3eeff"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 95,
    name: "Big Mango",
    cssCode: "background-image: linear-gradient(to top, #c71d6f 0%, #d09693 100%);",
    colors: ["#c71d6f", "#d09693"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 96,
    name: "Healthy Water",
    cssCode: "background-image: linear-gradient(60deg, #96deda 0%, #50c9c3 100%);",
    colors: ["#96deda", "#50c9c3"],
    gradientType: "linear",
    gradientDirection: 60,
    category: "Ocean"
  },
  {
    id: 97,
    name: "Amour Amour",
    cssCode: "background-image: linear-gradient(to top, #f77062 0%, #fe5196 100%);",
    colors: ["#f77062", "#fe5196"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 98,
    name: "Risky Concrete",
    cssCode: "background-image: linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%);",
    colors: ["#c4c5c7", "#dcdddf", "#ebebeb"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 99,
    name: "Strong Stick",
    cssCode: "background-image: linear-gradient(to right, #a8caba 0%, #5d4157 100%);",
    colors: ["#a8caba", "#5d4157"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Nature"
  },
  {
    id: 100,
    name: "Vicious Stance",
    cssCode: "background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);",
    colors: ["#29323c", "#485563"],
    gradientType: "linear",
    gradientDirection: 60,
    category: "Cool"
  },
  {
    id: 101,
    name: "Palo Alto",
    cssCode: "background-image: linear-gradient(-60deg, #16a085 0%, #f4d03f 100%);",
    colors: ["#16a085", "#f4d03f"],
    gradientType: "linear",
    gradientDirection: -60,
    category: "Nature"
  },
  {
    id: 102,
    name: "Happy Memories",
    cssCode: "background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);",
    colors: ["#ff5858", "#f09819"],
    gradientType: "linear",
    gradientDirection: -60,
    category: "Warm"
  },
  {
    id: 103,
    name: "Midnight Bloom",
    cssCode: "background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);",
    colors: ["#2b5876", "#4e4376"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Cool"
  },
  {
    id: 104,
    name: "Crystalline",
    cssCode: "background-image: linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%);",
    colors: ["#00cdac", "#8ddad5"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Ocean"
  },
  {
    id: 105,
    name: "Raccoon Back",
    cssCode: "background: linear-gradient(-180deg, #BCC5CE 0%, #929EAD 98%), radial-gradient(at top left, rgba(255,255,255,0.30) 0%, rgba(0,0,0,0.30) 100%); background-blend-mode: screen;",
    colors: ["#BCC5CE", "#929EAD"],
    gradientType: "linear",
    gradientDirection: -180,
    category: "Classic"
  },
  {
    id: 106,
    name: "Party Bliss",
    cssCode: "background-image: linear-gradient(to top, #4481eb 0%, #04befe 100%);",
    colors: ["#4481eb", "#04befe"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 107,
    name: "Confident Cloud",
    cssCode: "background-image: linear-gradient(to top, #dad4ec 0%, #dad4ec 1%, #f3e7e9 100%);",
    colors: ["#dad4ec", "#f3e7e9"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 108,
    name: "Le Cocktail",
    cssCode: "background-image: linear-gradient(45deg, #874da2 0%, #c43a30 100%);",
    colors: ["#874da2", "#c43a30"],
    gradientType: "linear",
    gradientDirection: 45,
    category: "Warm"
  },
  {
    id: 109,
    name: "River City",
    cssCode: "background-image: linear-gradient(to top, #4481eb 0%, #04befe 100%);",
    colors: ["#4481eb", "#04befe"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 110,
    name: "Frozen Berry",
    cssCode: "background-image: linear-gradient(to top, #e8198b 0%, #c7eafd 100%);",
    colors: ["#e8198b", "#c7eafd"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 111,
    name: "Elegance",
    cssCode: "background-image: radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%); background-blend-mode: screen;",
    colors: ["#EADFDF", "#ECE2DF"],
    gradientType: "radial",
    category: "Classic"
  },
  {
    id: 112,
    name: "Child Care",
    cssCode: "background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);",
    colors: ["#f794a4", "#fdd6bd"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Warm"
  },
  {
    id: 113,
    name: "Flying Lemon",
    cssCode: "background-image: linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%);",
    colors: ["#64b3f4", "#c2e59c"],
    gradientType: "linear",
    gradientDirection: 60,
    category: "Nature"
  },
  {
    id: 114,
    name: "New Retrowave",
    cssCode: "background-image: linear-gradient(to top, #3b41c5 0%, #a981bb 49%, #ffc8a9 100%);",
    colors: ["#3b41c5", "#a981bb", "#ffc8a9"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 115,
    name: "Hidden Jaguar",
    cssCode: "background-image: linear-gradient(to top, #0fd850 0%, #f9f047 100%);",
    colors: ["#0fd850", "#f9f047"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 116,
    name: "Above The Sky",
    cssCode: "background-image: linear-gradient(to top, lightgrey 0%, lightgrey 1%, #e0e0e0 26%, #efefef 48%, #d9d9d9 75%, #bcbcbc 100%);",
    colors: ["#e0e0e0", "#efefef", "#d9d9d9", "#bcbcbc"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 117,
    name: "Nega",
    cssCode: "background-image: linear-gradient(45deg, #ee9ca7 0%, #ffdde1 100%);",
    colors: ["#ee9ca7", "#ffdde1"],
    gradientType: "linear",
    gradientDirection: 45,
    category: "Warm"
  },
  {
    id: 118,
    name: "Dense Water",
    cssCode: "background-image: linear-gradient(to right, #3ab5b0 0%, #3d99be 31%, #56317a 100%);",
    colors: ["#3ab5b0", "#3d99be", "#56317a"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Ocean"
  },
  {
    id: 119,
    name: "Chemic Aqua",
    cssCode: "background-color: #CDDCDC; background-image: radial-gradient(at 50% 100%, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.25) 100%); background-blend-mode: screen, overlay;",
    colors: ["#CDDCDC"],
    gradientType: "linear",
    gradientDirection: 180,
    category: "Ocean"
  },
  {
    id: 120,
    name: "Seashore",
    cssCode: "background-image: linear-gradient(to top, #209cff 0%, #68e0cf 100%);",
    colors: ["#209cff", "#68e0cf"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 121,
    name: "Marble Wall",
    cssCode: "background-image: linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%);",
    colors: ["#bdc2e8", "#e6dee9"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 122,
    name: "Cheerful Caramel",
    cssCode: "background-image: linear-gradient(to top, #e6b980 0%, #eacda3 100%);",
    colors: ["#e6b980", "#eacda3"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 123,
    name: "Night Sky",
    cssCode: "background-image: linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%);",
    colors: ["#1e3c72", "#2a5298"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Cool"
  },
  {
    id: 124,
    name: "Magic Lake",
    cssCode: "background-image: linear-gradient(to top, #d5dee7 0%, #ffafbd 0%, #c9ffbf 100%);",
    colors: ["#d5dee7", "#ffafbd", "#c9ffbf"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 125,
    name: "Young Grass",
    cssCode: "background-image: linear-gradient(to top, #9be15d 0%, #00e3ae 100%);",
    colors: ["#9be15d", "#00e3ae"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 126,
    name: "Colorful Peach",
    cssCode: "background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);",
    colors: ["#ed6ea0", "#ec8c69"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 127,
    name: "Gentle Care",
    cssCode: "background-image: linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%);",
    colors: ["#ffc3a0", "#ffafbd"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 128,
    name: "Plum Bath",
    cssCode: "background-image: linear-gradient(to top, #cc208e 0%, #6713d2 100%);",
    colors: ["#cc208e", "#6713d2"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 129,
    name: "Happy Unicorn",
    cssCode: "background-image: linear-gradient(to top, #b3ffab 0%, #12fff7 100%);",
    colors: ["#b3ffab", "#12fff7"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 130,
    name: "Full Metal",
    cssCode: "background: linear-gradient(to bottom, #D5DEE7 0%, #E8EBF2 50%, #E2E7ED 100%), linear-gradient(to bottom, rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.02) 61%, rgba(0,0,0,0.02) 73%), linear-gradient(33deg, rgba(255,255,255,0.20) 0%, rgba(0,0,0,0.20) 100%); background-blend-mode: normal,color-burn;",
    colors: ["#D5DEE7", "#E8EBF2", "#E2E7ED"],
    gradientType: "linear",
    gradientDirection: 180,
    category: "Classic"
  },
  {
    id: 131,
    name: "African Field",
    cssCode: "background-image: linear-gradient(-45deg, #FFC796 0%, #FF6B95 100%);",
    colors: ["#FFC796", "#FF6B95"],
    gradientType: "linear",
    gradientDirection: -45,
    category: "Warm"
  },
  {
    id: 132,
    name: "Solid Stone",
    cssCode: "background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);",
    colors: ["#243949", "#517fa4"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Classic"
  },
  {
    id: 133,
    name: "Orange Juice",
    cssCode: "background-image: linear-gradient(-20deg, #fc6076 0%, #ff9a44 100%);",
    colors: ["#fc6076", "#ff9a44"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Warm"
  },
  {
    id: 134,
    name: "Glass Water",
    cssCode: "background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);",
    colors: ["#dfe9f3"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 135,
    name: "Slick Carbon",
    cssCode: "background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%); background-blend-mode: multiply;",
    colors: ["#323232", "#3F3F3F", "#1C1C1C"],
    gradientType: "linear",
    gradientDirection: 180,
    category: "Cool"
  },
  {
    id: 136,
    name: "North Miracle",
    cssCode: "background-image: linear-gradient(to right, #00dbde 0%, #fc00ff 100%);",
    colors: ["#00dbde", "#fc00ff"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Modern"
  },
  {
    id: 137,
    name: "Fruit Blend",
    cssCode: "background-image: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);",
    colors: ["#f9d423", "#ff4e50"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Warm"
  },
  {
    id: 138,
    name: "Millennium Pine",
    cssCode: "background-image: linear-gradient(to top, #50cc7f 0%, #f5d100 100%);",
    colors: ["#50cc7f", "#f5d100"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 139,
    name: "High Flight",
    cssCode: "background-image: linear-gradient(to right, #0acffe 0%, #495aff 100%);",
    colors: ["#0acffe", "#495aff"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Modern"
  },
  {
    id: 140,
    name: "Mole Hall",
    cssCode: "background-image: linear-gradient(-20deg, #616161 0%, #9bc5c3 100%);",
    colors: ["#616161", "#9bc5c3"],
    gradientType: "linear",
    gradientDirection: -20,
    category: "Classic"
  },
  {
    id: 141,
    name: "Earl Gray",
    cssCode: "background-color: #E4E4E1; background-image: radial-gradient(at top center, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.03) 100%), linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(143,152,157,0.60) 100%); background-blend-mode: normal, multiply;",
    colors: ["#E4E4E1"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Classic"
  },
  {
    id: 142,
    name: "Space Shift",
    cssCode: "background-image: linear-gradient(60deg, #3d3393 0%, #2b76b9 37%, #2cacd1 65%, #35eb93 100%);",
    colors: ["#3d3393", "#2b76b9", "#2cacd1", "#35eb93"],
    gradientType: "linear",
    gradientDirection: 60,
    category: "Modern"
  },
  {
    id: 143,
    name: "Forest Inei",
    cssCode: "background-image: linear-gradient(to top, #df89b5 0%, #bfd9fe 100%);",
    colors: ["#df89b5", "#bfd9fe"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Nature"
  },
  {
    id: 144,
    name: "Royal Garden",
    cssCode: "background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);",
    colors: ["#ed6ea0", "#ec8c69"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Nature"
  },
  {
    id: 145,
    name: "Rich Metal",
    cssCode: "background-image: linear-gradient(to right, #d7d2cc 0%, #304352 100%);",
    colors: ["#d7d2cc", "#304352"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Classic"
  },
  {
    id: 146,
    name: "Juicy Cake",
    cssCode: "background-image: linear-gradient(to top, #e14fad 0%, #f9d423 100%);",
    colors: ["#e14fad", "#f9d423"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Warm"
  },
  {
    id: 147,
    name: "Smart Indigo",
    cssCode: "background-image: linear-gradient(to top, #b224ef 0%, #7579ff 100%);",
    colors: ["#b224ef", "#7579ff"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Modern"
  },
  {
    id: 148,
    name: "Sand Strike",
    cssCode: "background-image: linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%);",
    colors: ["#c1c161", "#d4d4b1"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Classic"
  },
  {
    id: 149,
    name: "Norse Beauty",
    cssCode: "background-image: linear-gradient(to right, #ec77ab 0%, #7873f5 100%);",
    colors: ["#ec77ab", "#7873f5"],
    gradientType: "linear",
    gradientDirection: 90,
    category: "Modern"
  },
  {
    id: 150,
    name: "Aqua Guidance",
    cssCode: "background-image: linear-gradient(to top, #007adf 0%, #00ecbc 100%);",
    colors: ["#007adf", "#00ecbc"],
    gradientType: "linear",
    gradientDirection: 0,
    category: "Ocean"
  },
  {
    id: 151,
    name: "Sun Veggie",
    cssCode: "background-image: linear-gradient(-225deg, #20E2D7 0%, #F9FEA5 100%);",
    colors: ["#20E2D7", "#F9FEA5"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Nature"
  },
  {
    id: 152,
    name: "Sea Lord",
    cssCode: "background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);",
    colors: ["#2CD8D5", "#C5C1FF", "#FFBAC3"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Ocean"
  },
  {
    id: 153,
    name: "Black Sea",
    cssCode: "background-image: linear-gradient(-225deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%);",
    colors: ["#2CD8D5", "#6B8DD6", "#8E37D7"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Ocean"
  },
  {
    id: 154,
    name: "Grass Shampoo",
    cssCode: "background-image: linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%);",
    colors: ["#DFFFCD", "#90F9C4", "#39F3BB"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Nature"
  },
  {
    id: 155,
    name: "Landing Aircraft",
    cssCode: "background-image: linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%);",
    colors: ["#5D9FFF", "#B8DCFF", "#6BBBFF"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 156,
    name: "Witch Dance",
    cssCode: "background-image: linear-gradient(-225deg, #A8BFFF 0%, #884D80 100%);",
    colors: ["#A8BFFF", "#884D80"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Modern"
  },
  {
    id: 157,
    name: "Sleepless Night",
    cssCode: "background-image: linear-gradient(-225deg, #5271C4 0%, #B19FFF 48%, #ECA1FE 100%);",
    colors: ["#5271C4", "#B19FFF", "#ECA1FE"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 158,
    name: "Angel Care",
    cssCode: "background-image: linear-gradient(-225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%);",
    colors: ["#FFE29F", "#FFA99F", "#FF719A"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Warm"
  },
  {
    id: 159,
    name: "Crystal River",
    cssCode: "background-image: linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%);",
    colors: ["#22E1FF", "#1D8FE1", "#625EB1"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Ocean"
  },
  {
    id: 160,
    name: "Soft Lipstick",
    cssCode: "background-image: linear-gradient(-225deg, #B6CEE8 0%, #F578DC 100%);",
    colors: ["#B6CEE8", "#F578DC"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Warm"
  },
  {
    id: 161,
    name: "Salt Mountain",
    cssCode: "background-image: linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%);",
    colors: ["#FFFEFF", "#D7FFFE"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Classic"
  },
  {
    id: 162,
    name: "Perfect White",
    cssCode: "background-image: linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%);",
    colors: ["#E3FDF5", "#FFE6FA"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Classic"
  },
  {
    id: 163,
    name: "Fresh Oasis",
    cssCode: "background-image: linear-gradient(-225deg, #7DE2FC 0%, #B9B6E5 100%);",
    colors: ["#7DE2FC", "#B9B6E5"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Ocean"
  },
  {
    id: 164,
    name: "Strict November",
    cssCode: "background-image: linear-gradient(-225deg, #CBBACC 0%, #2580B3 100%);",
    colors: ["#CBBACC", "#2580B3"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 165,
    name: "Morning Salad",
    cssCode: "background-image: linear-gradient(-225deg, #B7F8DB 0%, #50A7C2 100%);",
    colors: ["#B7F8DB", "#50A7C2"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Nature"
  },
  {
    id: 166,
    name: "Deep Relief",
    cssCode: "background-image: linear-gradient(-225deg, #7085B6 0%, #87A7D9 50%, #DEF3F8 100%);",
    colors: ["#7085B6", "#87A7D9", "#DEF3F8"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 167,
    name: "Sea Strike",
    cssCode: "background-image: linear-gradient(-225deg, #77FFD2 0%, #6297DB 48%, #1EECFF 100%);",
    colors: ["#77FFD2", "#6297DB", "#1EECFF"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Ocean"
  },
  {
    id: 168,
    name: "Night Call",
    cssCode: "background-image: linear-gradient(-225deg, #AC32E4 0%, #7918F2 48%, #4801FF 100%);",
    colors: ["#AC32E4", "#7918F2", "#4801FF"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Modern"
  },
  {
    id: 169,
    name: "Supreme Sky",
    cssCode: "background-image: linear-gradient(-225deg, #D4FFEC 0%, #57F2CC 48%, #4596FB 100%);",
    colors: ["#D4FFEC", "#57F2CC", "#4596FB"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Ocean"
  },
  {
    id: 170,
    name: "Light Blue",
    cssCode: "background-image: linear-gradient(-225deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 100%);",
    colors: ["#9EFBD3", "#57E9F2", "#45D4FB"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 171,
    name: "Mind Crawl",
    cssCode: "background-image: linear-gradient(-225deg, #473B7B 0%, #3584A7 51%, #30D2BE 100%);",
    colors: ["#473B7B", "#3584A7", "#30D2BE"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 172,
    name: "Lily Meadow",
    cssCode: "background-image: linear-gradient(-225deg, #65379B 0%, #886AEA 53%, #6457C6 100%);",
    colors: ["#65379B", "#886AEA", "#6457C6"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Modern"
  },
  {
    id: 173,
    name: "Sugar Lollipop",
    cssCode: "background-image: linear-gradient(-225deg, #A445B2 0%, #D41872 52%, #FF0066 100%);",
    colors: ["#A445B2", "#D41872", "#FF0066"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Warm"
  },
  {
    id: 174,
    name: "Sweet Dessert",
    cssCode: "background-image: linear-gradient(-225deg, #7742B2 0%, #F180FF 52%, #FD8BD9 100%);",
    colors: ["#7742B2", "#F180FF", "#FD8BD9"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Warm"
  },
  {
    id: 175,
    name: "Magic Ray",
    cssCode: "background-image: linear-gradient(-225deg, #FF3CAC 0%, #562B7C 52%, #2B86C5 100%);",
    colors: ["#FF3CAC", "#562B7C", "#2B86C5"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Modern"
  },
  {
    id: 176,
    name: "Teen Party",
    cssCode: "background-image: linear-gradient(-225deg, #FF057C 0%, #8D0B93 50%, #321575 100%);",
    colors: ["#FF057C", "#8D0B93", "#321575"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Modern"
  },
  {
    id: 177,
    name: "Frozen Heat",
    cssCode: "background-image: linear-gradient(-225deg, #FF057C 0%, #7C64D5 48%, #4CC3FF 100%);",
    colors: ["#FF057C", "#7C64D5", "#4CC3FF"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  },
  {
    id: 178,
    name: "Gagarin View",
    cssCode: "background-image: linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%);",
    colors: ["#69EACB", "#EACCF8", "#6654F1"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Modern"
  },
  {
    id: 179,
    name: "Fabled Sunset",
    cssCode: "background-image: linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%);",
    colors: ["#231557", "#44107A", "#FF1361", "#FFF800"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Sunset"
  },
  {
    id: 180,
    name: "Perfect Blue",
    cssCode: "background-image: linear-gradient(-225deg, #3D4E81 0%, #5753C9 48%, #6E7FF3 100%);",
    colors: ["#3D4E81", "#5753C9", "#6E7FF3"],
    gradientType: "linear",
    gradientDirection: -225,
    category: "Cool"
  }
];

// Helper functions
export const getPresetsByCategory = (category: string) => {
  return gradientPresets.filter(preset => preset.category === category);
};

export const searchPresets = (query: string) => {
  return gradientPresets.filter(preset => 
    preset.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const convertPresetToBackgroundSettings = (preset: GradientPreset) => {
  return {
    type: 'solid' as const,
    color: preset.colors,
    gradientType: preset.gradientType,
    gradientDirection: preset.gradientDirection || 135,
    speed: 1,
    intensity: 1,
    mouseInteraction: false
  };
};
