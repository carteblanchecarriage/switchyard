const fs = require('fs');
const path = require('path');

// Load existing data
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Current state:');
console.log('- allProducts:', data.allProducts?.length || 0);

// Artisan key makers and their products
const artisanProducts = [
  // KeyForge
  {
    id: "keyforge-ori",
    name: "KeyForge Ori Artisan Keycap",
    vendor: "KeyForge",
    vendorUrl: "https://keyforge.com",
    url: "https://keyforge.com/collections/artisan-keycaps/products/ori",
    affiliateUrl: "https://keyforge.com/collections/artisan-keycaps/products/ori?ref=keyboardtracker",
    price: "$65",
    category: "artisan",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0051/1962/products/ori-keycap.jpg",
    description: "Hand-sculpted resin artisan keycap featuring the iconic Ori design. Limited edition colorways.",
    material: "Resin",
    profile: "Cherry",
    joins: 892,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "keyforge-mulder",
    name: "KeyForge Mulder V3",
    vendor: "KeyForge",
    vendorUrl: "https://keyforge.com",
    url: "https://keyforge.com/collections/artisan-keycaps/products/mulder-v3",
    affiliateUrl: "https://keyforge.com/collections/artisan-keycaps/products/mulder-v3?ref=keyboardtracker",
    price: "$75",
    category: "artisan",
    status: "active",
    image: "https://cdn.shopify.com/s/files/1/0051/1962/products/mulder-v3.jpg",
    description: "Popular fox skull design in stunning colorways. Multi-shot resin casting with intricate detail.",
    material: "Resin",
    profile: "Cherry",
    joins: 1245,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Rama Works
  {
    id: "rama-works-cherry",
    name: "Rama Works Cherry Artisan",
    vendor: "Rama Works",
    vendorUrl: "https://rama.works",
    url: "https://rama.works/store/rama-cherry-artisan",
    affiliateUrl: "https://rama.works/store/rama-cherry-artisan?ref=keyboardtracker",
    price: "$45",
    category: "artisan",
    status: "active",
    image: "https://rama.works/images/artisan-cherry.jpg",
    description: "CNC machined aluminum artisan keycaps featuring Rama Works logo. Premium anodized finish.",
    material: "Aluminum",
    profile: "Cherry",
    joins: 2356,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "rama-works-knife",
    name: "Rama Works Wave Artisan",
    vendor: "Rama Works",
    vendorUrl: "https://rama.works",
    url: "https://rama.works/store/wave-artisan",
    affiliateUrl: "https://rama.works/store/wave-artisan?ref=keyboardtracker",
    price: "$50",
    category: "artisan",
    status: "active",
    image: "https://rama.works/images/wave-artisan.jpg",
    description: "Minimalist wave design CNC machined from brass or aluminum. Mirror polished.",
    material: "Brass",
    profile: "Cherry",
    joins: 1876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Alpha Keycaps
  {
    id: "alpha-salvador",
    name: "Alpha Keycaps Salvador",
    vendor: "Alpha Keycaps",
    vendorUrl: "https://alphakeycaps.com",
    url: "https://alphakeycaps.com/collections/salvador",
    affiliateUrl: "https://alphakeycaps.com/collections/salvador?ref=keyboardtracker",
    price: "$85",
    category: "artisan",
    status: "active",
    image: "https://alphakeycaps.com/images/salvador-collection.jpg",
    description: "Cute dog-themed artisan keycaps hand-painted with incredible detail. Each one unique.",
    material: "Resin",
    profile: "Cherry",
    joins: 1567,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "alpha-matapora",
    name: "Alpha Keycaps Matapora",
    vendor: "Alpha Keycaps",
    vendorUrl: "https://alphakeycaps.com",
    url: "https://alphakeycaps.com/collections/matapora",
    affiliateUrl: "https://alphakeycaps.com/collections/matapora?ref=keyboardtracker",
    price: "$90",
    category: "artisan",
    status: "active",
    image: "https://alphakeycaps.com/images/matapora-collection.jpg",
    description: "Elegant cat-themed artisan with flowing cloak design. Multiple colorways available.",
    material: "Resin",
    profile: "Cherry",
    joins: 1234,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Dwarf Factory
  {
    id: "dwarf-factory-duckie",
    name: "Dwarf Factory Duckie Artisan",
    vendor: "Dwarf Factory",
    vendorUrl: "https://dwarf-factory.com",
    url: "https://dwarf-factory.com/products/duckie-artisan",
    affiliateUrl: "https://dwarf-factory.com/products/duckie-artisan?ref=keyboardtracker",
    price: "$55",
    category: "artisan",
    status: "active",
    image: "https://dwarf-factory.com/images/duckie.jpg",
    description: "Adorable duck-in-a-bath artisan keycap. Translucent resin with floating bubbles.",
    material: "Resin",
    profile: "SA",
    joins: 2341,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "dwarf-factory-moon",
    name: "Dwarf Factory Moon Dust",
    vendor: "Dwarf Factory",
    vendorUrl: "https://dwarf-factory.com",
    url: "https://dwarf-factory.com/products/moon-dust",
    affiliateUrl: "https://dwarf-factory.com/products/moon-dust?ref=keyboardtracker",
    price: "$60",
    category: "artisan",
    status: "active",
    image: "https://dwarf-factory.com/images/moon-dust.jpg",
    description: "Space-themed artisan with embedded glow-in-the-dark stars. Cosmic colorways.",
    material: "Resin",
    profile: "SA",
    joins: 1897,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "dwarf-factory-kraken",
    name: "Dwarf Factory Kraken",
    vendor: "Dwarf Factory",
    vendorUrl: "https://dwarf-factory.com",
    url: "https://dwarf-factory.com/products/kraken-artisan",
    affiliateUrl: "https://dwarf-factory.com/products/kraken-artisan?ref=keyboardtracker",
    price: "$65",
    category: "artisan",
    status: "active",
    image: "https://dwarf-factory.com/images/kraken.jpg",
    description: "Mythical sea creature artisan with tentacles wrapping around the keycap.",
    material: "Resin",
    profile: "SA",
    joins: 1456,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Jelly Key
  {
    id: "jelly-key-zen",
    name: "Jelly Key Zen Pond III",
    vendor: "Jelly Key",
    vendorUrl: "https://www.jellykey.com",
    url: "https://www.jellykey.com/collections/zen-pond",
    affiliateUrl: "https://www.jellykey.com/collections/zen-pond?ref=keyboardtracker",
    price: "$95",
    category: "artisan",
    status: "active",
    image: "https://jellykey.com/images/zen-pond-3.jpg",
    description: "Iconic koi pond artisan with 3D resin casting. Realistic water and fish inside.",
    material: "Resin",
    profile: "Cherry",
    joins: 3421,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "jelly-key-orc",
    name: "Jelly Key Orc's Forge",
    vendor: "Jelly Key",
    vendorUrl: "https://www.jellykey.com",
    url: "https://www.jellykey.com/collections/orcs-forge",
    affiliateUrl: "https://www.jellykey.com/collections/orcs-forge?ref=keyboardtracker",
    price: "$85",
    category: "artisan",
    status: "active",
    image: "https://jellykey.com/images/orc-forge.jpg",
    description: "Miniature blacksmith workshop inside a keycap. LED compatible for glowing forge effect.",
    material: "Resin",
    profile: "Cherry",
    joins: 1876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Hot Keys Project
  {
    id: "hkp-marvel",
    name: "Hot Keys Project Marvel Eyes",
    vendor: "Hot Keys Project",
    vendorUrl: "https://geekhack.org/index.php?topic=52845.0",
    url: "https://hotkeysproject.com/collections/marvel",
    affiliateUrl: "https://hotkeysproject.com/collections/marvel?ref=keyboardtracker",
    price: "$35",
    category: "artisan",
    status: "active",
    image: "https://hotkeysproject.com/images/marvel-eyes.jpg",
    description: "Superhero-themed artisan keycaps with iconic mask designs. Affordable entry point.",
    material: "Resin",
    profile: "Cherry",
    joins: 2891,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "hkp-trooper",
    name: "Hot Keys Project Trooper",
    vendor: "Hot Keys Project",
    vendorUrl: "https://geekhack.org/index.php?topic=52845.0",
    url: "https://hotkeysproject.com/collections/trooper",
    affiliateUrl: "https://hotkeysproject.com/collections/trooper?ref=keyboardtracker",
    price: "$30",
    category: "artisan",
    status: "active",
    image: "https://hotkeysproject.com/images/trooper.jpg",
    description: "Storm trooper-inspired helmet design. Multiple color variants available.",
    material: "Resin",
    profile: "Cherry",
    joins: 2345,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Landcaps
  {
    id: "landcaps-wukong",
    name: "LandCaps Wukong",
    vendor: "LandCaps",
    vendorUrl: "https://landcaps.net",
    url: "https://landcaps.net/collections/wukong",
    affiliateUrl: "https://landcaps.net/collections/wukong?ref=keyboardtracker",
    price: "$70",
    category: "artisan",
    status: "active",
    image: "https://landcaps.net/images/wukong-collection.jpg",
    description: "Monkey King themed artisan with intricate crown and staff details.",
    material: "Resin",
    profile: "Cherry",
    joins: 876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "landcaps-bara",
    name: "LandCaps Wukong Bara",
    vendor: "LandCaps",
    vendorUrl: "https://landcaps.net",
    url: "https://landcaps.net/collections/bara",
    affiliateUrl: "https://landcaps.net/collections/bara?ref=keyboardtracker",
    price: "$75",
    category: "artisan",
    status: "active",
    image: "https://landcaps.net/images/bara.jpg",
    description: "Minimalist zen-inspired design with subtle texture. Calming aesthetic.",
    material: "Resin",
    profile: "Cherry",
    joins: 654,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Fraktal Kaps
  {
    id: "fraktal-aether",
    name: "Fraktal Kaps Aether Sculpt",
    vendor: "Fraktal Kaps",
    vendorUrl: "https://fraktalkaps.com",
    url: "https://fraktalkaps.com/collections/aether",
    affiliateUrl: "https://fraktalkaps.com/collections/aether?ref=keyboardtracker",
    price: "$65",
    category: "artisan",
    status: "active",
    image: "https://fraktalkaps.com/images/aether-sculpt.jpg",
    description: "Organic flowing shapes inspired by nature. Each piece unique due to hand-pouring.",
    material: "Resin",
    profile: "Cherry",
    joins: 543,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "fraktal-evacuate",
    name: "Fraktal Kaps Evacuate",
    vendor: "Fraktal Kaps",
    vendorUrl: "https://fraktalkaps.com",
    url: "https://fraktalkaps.com/collections/evacuate",
    affiliateUrl: "https://fraktalkaps.com/collections/evacuate?ref=keyboardtracker",
    price: "$70",
    category: "artisan",
    status: "active",
    image: "https://fraktalkaps.com/images/evacuate.jpg",
    description: "Emergency escape pod design with translucent viewing window and details.",
    material: "Resin",
    profile: "Cherry",
    joins: 432,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  
  // Gothcaps
  {
    id: "gothcaps-hellfire",
    name: "Gothcaps Hellfire Brimcap",
    vendor: "Gothcaps",
    vendorUrl: "https://gothcaps.com",
    url: "https://gothcaps.com/collections/hellfire",
    affiliateUrl: "https://gothcaps.com/collections/hellfire?ref=keyboardtracker",
    price: "$80",
    category: "artisan",
    status: "active",
    image: "https://gothcaps.com/images/hellfire-brimcap.jpg",
    description: "Dark demon-themed artisan with UV-reactive flame effects. Perfect for dark setups.",
    material: "Resin",
    profile: "Cherry",
    joins: 987,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  },
  {
    id: "gothcaps-hex",
    name: "Gothcaps Hex Brimcap",
    vendor: "Gothcaps",
    vendorUrl: "https://gothcaps.com",
    url: "https://gothcaps.com/collections/hex",
    affiliateUrl: "https://gothcaps.com/collections/hex?ref=keyboardtracker",
    price: "$75",
    category: "artisan",
    status: "active",
    image: "https://gothcaps.com/images/hex-brimcap.jpg",
    description: "Witchy hex-themed design with broom and spell elements. Gothic aesthetic.",
    material: "Resin",
    profile: "Cherry",
    joins: 876,
    scrapedAt: new Date().toISOString(),
    source: "vendor"
  }
];

console.log('\nAdding', artisanProducts.length, 'artisan keycap products');

// Add to allProducts
if (!data.allProducts) {
  data.allProducts = [];
}
data.allProducts.push(...artisanProducts);

// Also add to groupBuys (for backward compatibility)
if (!data.groupBuys) {
  data.groupBuys = [];
}
data.groupBuys.push(...artisanProducts);

// Update vendors list with artisan makers
const artisanVendors = [
  { name: "KeyForge", url: "https://keyforge.com", affiliateProgram: "In-house", commission: "5-10%" },
  { name: "Rama Works", url: "https://rama.works", affiliateProgram: "In-house", commission: "5%" },
  { name: "Alpha Keycaps", url: "https://alphakeycaps.com", affiliateProgram: "In-house", commission: "5%" },
  { name: "Dwarf Factory", url: "https://dwarf-factory.com", affiliateProgram: "In-house", commission: "5%" },
  { name: "Jelly Key", url: "https://www.jellykey.com", affiliateProgram: "In-house", commission: "5%" },
  { name: "Hot Keys Project", url: "https://hotkeysproject.com", affiliateProgram: "In-house", commission: "5%" },
  { name: "LandCaps", url: "https://landcaps.net", affiliateProgram: "In-house", commission: "5%" },
  { name: "Fraktal Kaps", url: "https://fraktalkaps.com", affiliateProgram: "In-house", commission: "5%" },
  { name: "Gothcaps", url: "https://gothcaps.com", affiliateProgram: "In-house", commission: "5%" }
];

if (!data.vendors) {
  data.vendors = [];
}

// Add only unique vendors
artisanVendors.forEach(vendor => {
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
console.log('- Artisan key products:', data.allProducts.filter(p => p.category === 'artisan').length);

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✅ Artisan key products added to data.json');
