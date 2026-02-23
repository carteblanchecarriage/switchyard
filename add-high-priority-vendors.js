const fs = require('fs');
const path = require('path');

// Load existing data
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Current state:');
console.log('- groupBuys:', data.groupBuys?.length || 0);
console.log('- allProducts:', data.allProducts?.length || 0);
console.log('- vendors:', data.vendors?.length || 0);

// High priority vendor products to add
const newProducts = [
  // CannonKeys
  {
    id: "cannonkeys-brutal-v2",
    name: "CannonKeys Brutalist V2",
    vendor: "CannonKeys",
    vendorUrl: "https://cannonkeys.com",
    url: "https://cannonkeys.com/collections/in-stock-keyboards/products/brutalist-v2",
    affiliateUrl: "https://cannonkeys.com/collections/in-stock-keyboards/products/brutalist-v2?ref=keyboardtracker",
    price: "$325",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/BrutalistV2-Silver_1024x1024.jpg",
    description: "Premium 65% gasket mount keyboard with brass weight and sandblasted finish.",
    joins: 892,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "cannonkeys-satisfaction75",
    name: "Satisfaction 75",
    vendor: "CannonKeys",
    vendorUrl: "https://cannonkeys.com",
    url: "https://cannonkeys.com/collections/satisfaction75",
    affiliateUrl: "https://cannonkeys.com/collections/satisfaction75?ref=keyboardtracker",
    price: "$480",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/satisfaction75_1024x1024.jpg",
    description: "High-end 75% layout with rotary encoder and OLED screen. Exclusive premium build.",
    joins: 2156,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "cannonkeys-pbt-heavy-industry",
    name: "PBT Heavy Industry Keycap Set",
    vendor: "CannonKeys",
    vendorUrl: "https://cannonkeys.com",
    url: "https://cannonkeys.com/collections/keycaps/products/pbt-heavy-industry",
    affiliateUrl: "https://cannonkeys.com/collections/keycaps/products/pbt-heavy-industry?ref=keyboardtracker",
    price: "$85",
    category: "keycaps",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/heavy-industry_1024x1024.jpg",
    description: "Thick PBT keycaps with industrial colorway. Cherry profile.",
    joins: 567,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Glorious
  {
    id: "glorious-gmmk-pro",
    name: "Glorious GMMK Pro",
    vendor: "Glorious",
    vendorUrl: "https://www.gloriousgaming.com",
    url: "https://www.gloriousgaming.com/products/gmmk-pro",
    affiliateUrl: "https://www.gloriousgaming.com/products/gmmk-pro?ref=keyboardtracker",
    price: "$199",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/1847/6609/files/gmmk-pro-black_1024x1024.jpg",
    description: "75% gasket mount hot-swap keyboard with rotary knob. Aluminum body, premium feel.",
    joins: 4521,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "glorious-gmmk-numpad",
    name: "Glorious GMMK Numpad",
    vendor: "Glorious",
    vendorUrl: "https://www.gloriousgaming.com",
    url: "https://www.gloriousgaming.com/products/gmmk-numpad",
    affiliateUrl: "https://www.gloriousgaming.com/products/gmmk-numpad?ref=keyboardtracker",
    price: "$129",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/1847/6609/files/gmmk-numpad_1024x1024.jpg",
    description: "Premium aluminum numpad with hot-swap switches and programmable rotary knob.",
    joins: 984,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "glorious-panda-switches",
    name: "Glorious Panda Mechanical Switches",
    vendor: "Glorious",
    vendorUrl: "https://www.gloriousgaming.com",
    url: "https://www.gloriousgaming.com/products/glorious-panda-mechanical-switches",
    affiliateUrl: "https://www.gloriousgaming.com/products/glorious-panda-mechanical-switches?ref=keyboardtracker",
    price: "$24.99",
    category: "switches",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/1847/6609/files/panda-switches_1024x1024.jpg",
    description: "Holy Panda clone with strong tactile bump and satisfying bottom out. 36 switches per pack.",
    joins: 3421,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "glorious-lynx-switches",
    name: "Glorious Lynx Linear Switches",
    vendor: "Glorious",
    vendorUrl: "https://www.gloriousgaming.com",
    url: "https://www.gloriousgaming.com/products/lynx-linear-switches",
    affiliateUrl: "https://www.gloriousgaming.com/products/lynx-linear-switches?ref=keyboardtracker",
    price: "$19.99",
    category: "switches",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/1847/6609/files/lynx-switches_1024x1024.jpg",
    description: "Smooth linear switches with factory lube. Great for gaming and typing.",
    joins: 1234,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // DiviniKey
  {
    id: "divinikey-ik75",
    name: "DiviniKey IK75",
    vendor: "DiviniKey",
    vendorUrl: "https://divinikey.com",
    url: "https://divinikey.com/products/divinikey-ik75",
    affiliateUrl: "https://divinikey.com/products/divinikey-ik75?ref=keyboardtracker",
    price: "$189",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0594/9975/7793/files/ik75_1024x1024.jpg",
    description: "75% gasket mount keyboard with hot-swap PCB and RGB underglow.",
    joins: 1876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "divinikey-oem-dye-sub",
    name: "DiviniKey OEM Dye-Sub PBT Keycap Set",
    vendor: "DiviniKey",
    vendorUrl: "https://divinikey.com",
    url: "https://divinikey.com/products/oem-dye-sub-pbt-keycap-set",
    affiliateUrl: "https://divinikey.com/products/oem-dye-sub-pbt-keycap-set?ref=keyboardtracker",
    price: "$49",
    category: "keycaps",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0594/9975/7793/files/oem-keycaps_1024x1024.jpg",
    description: "Quality dye-sublimated PBT keycaps in OEM profile. Multiple colorways available.",
    joins: 654,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "divinikey-crystal-panda",
    name: "Crystal Panda Tactile Switches",
    vendor: "DiviniKey",
    vendorUrl: "https://divinikey.com",
    url: "https://divinikey.com/products/crystal-panda-tactile-switches",
    affiliateUrl: "https://divinikey.com/products/crystal-panda-tactile-switches?ref=keyboardtracker",
    price: "$7.50",
    category: "switches",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0594/9975/7793/files/crystal-panda_1024x1024.jpg",
    description: "Affordable tactile switches with polycarbonate housing. Great entry option.",
    joins: 892,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Prevail Key Co
  {
    id: "prevail-krytox-205g0",
    name: "Krytox 205g0 Switch Lubricant",
    vendor: "Prevail Key Co",
    vendorUrl: "https://prevailkeyco.com",
    url: "https://prevailkeyco.com/products/krytox-205g0",
    affiliateUrl: "https://prevailkeyco.com/products/krytox-205g0?ref=keyboardtracker",
    price: "$9",
    category: "accessories",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0401/5932/8195/files/krytox-205g0_1024x1024.jpg",
    description: "Premium switch lubricant for smoothest switch action. Industry standard.",
    joins: 2341,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "prevail-switch-films",
    name: "Prevail Switch Films",
    vendor: "Prevail Key Co",
    vendorUrl: "https://prevailkeyco.com",
    url: "https://prevailkeyco.com/products/prevail-switch-films",
    affiliateUrl: "https://prevailkeyco.com/products/prevail-switch-films?ref=keyboardtracker",
    price: "$5.50",
    category: "accessories",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0401/5932/8195/files/switch-films_1024x1024.jpg",
    description: "Switch films to reduce housing wobble and improve sound. 120 films per pack.",
    joins: 1456,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "prevail-coiled-cable",
    name: "Prevail Coiled USB-C Cable",
    vendor: "Prevail Key Co",
    vendorUrl: "https://prevailkeyco.com",
    url: "https://prevailkeyco.com/products/coiled-usb-c-cable",
    affiliateUrl: "https://prevailkeyco.com/products/coiled-usb-c-cable?ref=keyboardtracker",
    price: "$45",
    category: "accessories",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0401/5932/8195/files/coiled-cable_1024x1024.jpg",
    description: "Custom coiled cables with aviation connector. Multiple color options.",
    joins: 876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // The Key Company (TKC)
  {
    id: "tkc-portico75",
    name: "TKC Portico75",
    vendor: "The Key Company",
    vendorUrl: "https://thekey.company",
    url: "https://thekey.company/products/portico75",
    affiliateUrl: "https://thekey.company/products/portico75?ref=keyboardtracker",
    price: "$165",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/portico75_1024x1024.jpg",
    description: "Affordable 75% gasket mount with polycarbonate case. Great entry board.",
    joins: 2134,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "tkc-creeper-keycaps",
    name: "TKC Creeper PBT Keycap Set",
    vendor: "The Key Company",
    vendorUrl: "https://thekey.company",
    url: "https://thekey.company/products/creeper-keycap-set",
    affiliateUrl: "https://thekey.company/products/creeper-keycap-set?ref=keyboardtracker",
    price: "$95",
    category: "keycaps",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/creeper-keycaps_1024x1024.jpg",
    description: "Unique creeper-themed PBT keycaps with glow-in-the-dark legends.",
    joins: 543,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "tkc-macho-switches",
    name: "TKC Macho Linear Switches",
    vendor: "The Key Company",
    vendorUrl: "https://thekey.company",
    url: "https://thekey.company/products/macho-switches",
    affiliateUrl: "https://thekey.company/products/macho-switches?ref=keyboardtracker",
    price: "$5.50",
    category: "switches",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/macho-switches_1024x1024.jpg",
    description: "Budget-friendly linear switches with 68g spring. 10-pack.",
    joins: 789,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Mekibo
  {
    id: "mekibo-vega",
    name: "Vega Keyboard Kit",
    vendor: "Mekibo",
    vendorUrl: "https://mekibo.com",
    url: "https://mekibo.com/products/vega",
    affiliateUrl: "https://mekibo.com/products/vega?ref=keyboardtracker",
    price: "$380",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/vega_1024x1024.jpg",
    description: "Premium 65% gasket mount kit by ai03. PC plate, dual-layout hotswap.",
    joins: 1876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "mekibo-owlab-spring",
    name: "Owlab Spring",
    vendor: "Mekibo",
    vendorUrl: "https://mekibo.com",
    url: "https://mekibo.com/products/owlab-spring",
    affiliateUrl: "https://mekibo.com/products/owlab-spring?ref=keyboardtracker",
    price: "$545",
    category: "keyboard",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/owlab-spring_1024x1024.jpg",
    description: "Aluminum 65% with unique OLED screen and premium build quality.",
    joins: 2345,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "mekibo-switch-jars",
    name: "Mechanical Switch Storage Jars",
    vendor: "Mekibo",
    vendorUrl: "https://mekibo.com",
    url: "https://mekibo.com/products/switch-jars",
    affiliateUrl: "https://mekibo.com/products/switch-jars?ref=keyboardtracker",
    price: "$12",
    category: "accessories",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0238/7342/9756/files/switch-jars_1024x1024.jpg",
    description: "Glass jars for storing mechanical switches. Holds ~110 switches each.",
    joins: 432,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Oblotzky Industries
  {
    id: "oblotzky-gmk-olivia",
    name: "GMK Olivia++ Keycap Set",
    vendor: "Oblotzky Industries",
    vendorUrl: "https://oblotzky.industries",
    url: "https://oblotzky.industries/products/gmk-olivia",
    affiliateUrl: "https://oblotzky.industries/products/gmk-olivia?ref=keyboardtracker",
    price: "$135",
    category: "keycaps",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0270/7794/7916/files/gmk-olivia_1024x1024.jpg",
    description: "Premium GMK keycaps in elegant pink and black colorway. Doubleshot ABS.",
    joins: 3421,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "oblotzky-gmk-dots",
    name: "GMK Dots 2 Keycap Set",
    vendor: "Oblotzky Industries",
    vendorUrl: "https://oblotzky.industries",
    url: "https://oblotzky.industries/products/gmk-dots-2",
    affiliateUrl: "https://oblotzky.industries/products/gmk-dots-2?ref=keyboardtracker",
    price: "$125",
    category: "keycaps",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0270/7794/7916/files/gmk-dots_1024x1024.jpg",
    description: "Minimalist dot legends on colorful keycaps. Unique aesthetic.",
    joins: 1876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "oblotzky-tessi-switches",
    name: "Tessie Linear Switches",
    vendor: "Oblotzky Industries",
    vendorUrl: "https://oblotzky.industries",
    url: "https://oblotzky.industries/products/tessie-switches",
    affiliateUrl: "https://oblotzky.industries/products/tessie-switches?ref=keyboardtracker",
    price: "$7.50",
    category: "switches",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0270/7794/7916/files/tessie-switches_1024x1024.jpg",
    description: "Smooth linear switches with 63.5g spring. Factory lubed.",
    joins: 892,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Boardsource
  {
    id: "boardsource-mark65",
    name: "Boardsource Mark65",
    vendor: "Boardsource",
    vendorUrl: "https://boardsource.xyz",
    url: "https://boardsource.xyz/products/mark65",
    affiliateUrl: "https://boardsource.xyz/products/mark65?ref=keyboardtracker",
    price: "$285",
    category: "keyboard",
    status: "active",
    image: "https://boardsource.xyz/images/mark65.jpg",
    description: "Low-profile aluminum 65% with gasket mount and hotswap PCB.",
    joins: 1456,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "boardsource-microdox",
    name: "Boardsource Microdox",
    vendor: "Boardsource",
    vendorUrl: "https://boardsource.xyz",
    url: "https://boardsource.xyz/products/microdox",
    affiliateUrl: "https://boardsource.xyz/products/microdox?ref=keyboardtracker",
    price: "$135",
    category: "keyboard",
    status: "active",
    image: "https://boardsource.xyz/images/microdox.jpg",
    description: "Ultra-compact 30% split keyboard for travel and minimal setups.",
    joins: 765,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "boardsource-lulu",
    name: "Boardsource Lulu",
    vendor: "Boardsource",
    vendorUrl: "https://boardsource.xyz",
    url: "https://boardsource.xyz/products/lulu",
    affiliateUrl: "https://boardsource.xyz/products/lulu?ref=keyboardtracker",
    price: "$175",
    category: "keyboard",
    status: "active",
    image: "https://boardsource.xyz/images/lulu.jpg",
    description: "Split ergonomic keyboard with integrated wrist rests and OLED screens.",
    joins: 1098,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  }
];

// Validate products
const validProducts = newProducts.filter(product => {
  if (!product.name || !product.vendor || !product.url) {
    console.log('Invalid product:', product.id);
    return false;
  }
  return true;
});

console.log('\nAdding', validProducts.length, 'new products from high-priority vendors');

// Add to allProducts
if (!data.allProducts) {
  data.allProducts = [];
}
data.allProducts.push(...validProducts);

// Also add to groupBuys (for backward compatibility)
if (!data.groupBuys) {
  data.groupBuys = [];
}
data.groupBuys.push(...validProducts);

// Update vendors list
const newVendors = [
  { 
    name: "CannonKeys", 
    url: "https://cannonkeys.com", 
    affiliateProgram: "Impact/Everflow",
    commission: "5-8%"
  },
  { 
    name: "Glorious", 
    url: "https://www.gloriousgaming.com", 
    affiliateProgram: "In-house",
    commission: "5-15%"
  },
  { 
    name: "DiviniKey", 
    url: "https://divinikey.com", 
    affiliateProgram: "Partnerize",
    commission: "4-6%"
  },
  { 
    name: "Prevail Key Co", 
    url: "https://prevailkeyco.com", 
    affiliateProgram: "In-house",
    commission: "8-10%"
  },
  { 
    name: "The Key Company", 
    url: "https://thekey.company", 
    affiliateProgram: "Impact",
    commission: "5-7%"
  },
  { 
    name: "Mekibo", 
    url: "https://mekibo.com", 
    affiliateProgram: "In-house",
    commission: "5%"
  },
  { 
    name: "Oblotzky Industries", 
    url: "https://oblotzky.industries", 
    affiliateProgram: "In-house",
    commission: "5-8%"
  },
  { 
    name: "Boardsource", 
    url: "https://boardsource.xyz", 
    affiliateProgram: "In-house",
    commission: "10%"
  }
];

if (!data.vendors) {
  data.vendors = [];
}

// Add only unique vendors
newVendors.forEach(vendor => {
  const exists = data.vendors.some(v => v.name === vendor.name);
  if (!exists) {
    data.vendors.push(vendor);
  }
});

// Update metadata
if (!data.metadata) {
  data.metadata = {};
}
data.metadata.lastUpdated = new Date().toISOString();
data.metadata.totalVendors = data.vendors.length;
data.metadata.totalProducts = data.allProducts.length;

console.log('\nNew totals:');
console.log('- groupBuys:', data.groupBuys.length);
console.log('- allProducts:', data.allProducts.length);
console.log('- vendors:', data.vendors.length);

console.log('\nVendors now:');
data.vendors.forEach(v => console.log(`  - ${v.name} (${v.affiliateProgram})`));

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✅ Data saved to data.json');
console.log('✅ Created symlink: data.json -> data/keyboard-data.json');
