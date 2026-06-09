const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file to get MONGODB_URI
const envPath = path.join(__dirname, '../.env.local');
let mongodbUri = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);
  if (match && match[1]) {
    mongodbUri = match[1].trim().replace(/['"]/g, '');
  }
}

if (!mongodbUri) {
  mongodbUri = 'mongodb+srv://CareMom:xI2QuBaFZsYQ5vRD@cluster0.e5n1hnl.mongodb.net/CareMom';
}

console.log('Connecting to MongoDB...');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
});
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  purchasePrice: { type: Number },
  discountRate: { type: Number },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: String }],
  images: [{ type: String }],
  attributes: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const productsData = [
  // Category 1: Motherhood & Maternity
  {
    name: 'Double Wearable Electric Breast Pump',
    slug: 'double-wearable-electric-breast-pump',
    description: 'Quiet, wearable electric breast pump with hands-free design. Features 3 modes and 9 suction levels for comfort and efficiency. BPA-free and leak-proof.',
    price: 4500,
    salePrice: 3800,
    discountRate: 16,
    purchasePrice: 2800,
    stock: 45,
    sku: 'CM-MAT-EBP01',
    categorySlug: 'motherhood-maternity',
    images: ['/assets/images/products/electric_breast_pump.webp'],
    tags: ['maternity', 'breast pump', 'newborn', 'care'],
    attributes: [{ key: 'Battery', value: '1200mAh' }, { key: 'Material', value: 'BPA-free Silicone' }],
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: 'C-Shaped Maternity Body Pillow',
    slug: 'c-shaped-maternity-body-pillow',
    description: 'Ergonomic C-shaped body pillow designed for pregnant mothers. Supports back, hips, knees, neck, and head to relieve sleeping discomfort.',
    price: 2500,
    purchasePrice: 1500,
    stock: 30,
    sku: 'CM-MAT-MSP02',
    categorySlug: 'motherhood-maternity',
    images: ['/assets/images/products/maternity_support_pillow.webp'],
    tags: ['pillow', 'maternity', 'pregnancy', 'sleep'],
    attributes: [{ key: 'Shape', value: 'C-Shape' }, { key: 'Cover', value: '100% Organic Muslin Cotton' }],
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true
  },
  {
    name: 'Organic Stretch Mark Cream',
    slug: 'organic-stretch-mark-cream',
    description: 'Natural stretch mark removal and prevention cream. Enriched with shea butter, cocoa butter, and vitamin E to restore skin elasticity.',
    price: 1200,
    salePrice: 950,
    discountRate: 21,
    purchasePrice: 600,
    stock: 80,
    sku: 'CM-MAT-SMC03',
    categorySlug: 'motherhood-maternity',
    images: ['/assets/images/products/stretch_mark_cream.webp'],
    tags: ['skin care', 'stretch mark', 'organic', 'maternity'],
    attributes: [{ key: 'Weight', value: '150g' }, { key: 'Ingredients', value: 'Shea Butter, Cocoa Butter, Vitamin E' }],
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: true
  },
  {
    name: 'Premium Organic Cotton Nursing Bras',
    slug: 'premium-organic-cotton-nursing-bras',
    description: 'Super-soft, wireless nursing bras with easy one-hand clasp access. Made of breathable organic cotton fabric for absolute daily comfort.',
    price: 1800,
    salePrice: 1500,
    discountRate: 17,
    purchasePrice: 1000,
    stock: 50,
    sku: 'CM-MAT-NCB04',
    categorySlug: 'motherhood-maternity',
    images: ['/assets/images/products/nursing_bras.webp'],
    tags: ['clothing', 'bra', 'nursing', 'maternity'],
    attributes: [{ key: 'Material', value: '95% Organic Cotton, 5% Spandex' }, { key: 'Clasp Type', value: 'One-hand clip down' }],
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: false
  },
  {
    name: 'Adjustable Postpartum Recovery Belt',
    slug: 'adjustable-postpartum-recovery-belt',
    description: 'Supportive 3-in-1 postpartum recovery belly wrap. Helps shrink the belly, support the waist, and hold the lower back during recovery.',
    price: 1500,
    purchasePrice: 900,
    stock: 40,
    sku: 'CM-MAT-PRB05',
    categorySlug: 'motherhood-maternity',
    images: ['/assets/images/products/recovery_belt.webp'],
    tags: ['recovery', 'maternity', 'postpartum', 'belt'],
    attributes: [{ key: 'Sizes', value: 'M, L, XL' }, { key: 'Material', value: 'Polyester, Spandex' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: true
  },

  // Category 2: Baby Care & Essentials
  {
    name: 'Foldable Ergonomic Baby Bath Tub',
    slug: 'foldable-ergonomic-baby-bath-tub',
    description: 'Collapsible space-saving baby bath tub with smart temperature indicator plug. Designed with supportive slip-resistant legs and safety lock.',
    price: 2800,
    salePrice: 2200,
    discountRate: 21,
    purchasePrice: 1400,
    stock: 25,
    sku: 'CM-BABY-FBT06',
    categorySlug: 'baby-care-essentials',
    images: ['/assets/images/products/baby_bath_tub.webp'],
    tags: ['baby bath', 'tub', 'hygiene', 'safety'],
    attributes: [{ key: 'Type', value: 'Foldable' }, { key: 'Dimensions', value: '80 x 48 x 21 cm' }],
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: 'Gentle Moisturizing Organic Baby Lotion',
    slug: 'gentle-moisturizing-organic-baby-lotion',
    description: 'Hypoallergenic, deeply moisturizing organic baby lotion. Formulated with organic aloe vera, calendula, and chamomile extracts.',
    price: 950,
    purchasePrice: 550,
    stock: 120,
    sku: 'CM-BABY-OBL07',
    categorySlug: 'baby-care-essentials',
    images: ['/assets/images/products/baby_lotion.webp'],
    tags: ['lotion', 'hygiene', 'skin care', 'baby'],
    attributes: [{ key: 'Volume', value: '250ml' }, { key: 'pH Level', value: '5.5 (Balanced)' }],
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true
  },
  {
    name: 'Complete Baby Grooming & Health Kit',
    slug: 'complete-baby-grooming-health-kit',
    description: '10-piece baby grooming kit with safety scissors, clippers, brush, comb, and nasal aspirator. Perfect for maintaining infant hygiene.',
    price: 1400,
    salePrice: 1100,
    discountRate: 21,
    purchasePrice: 700,
    stock: 65,
    sku: 'CM-BABY-BGK08',
    categorySlug: 'baby-care-essentials',
    images: ['/assets/images/products/baby_grooming_kit.webp'],
    tags: ['hygiene', 'baby care', 'grooming', 'kit'],
    attributes: [{ key: 'Pieces', value: '10 Items' }, { key: 'Case Material', value: 'EVA fabric case' }],
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: true
  },
  {
    name: 'Patterned Muslin Swaddle Blankets Set',
    slug: 'patterned-muslin-swaddle-blankets-set',
    description: 'Set of 3 extra-large muslin swaddle blankets made of organic cotton. Highly breathable, soft, and pre-washed for infant comfort.',
    price: 1600,
    salePrice: 1350,
    discountRate: 16,
    purchasePrice: 850,
    stock: 45,
    sku: 'CM-BABY-MSB09',
    categorySlug: 'baby-care-essentials',
    images: ['/assets/images/products/muslin_swaddles.webp'],
    tags: ['swaddle', 'blanket', 'cotton', 'baby'],
    attributes: [{ key: 'Size', value: '120 x 120 cm' }, { key: 'Count', value: '3 Swaddles' }],
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: false
  },
  {
    name: 'Animal Silicone Baby Teethers Set',
    slug: 'animal-silicone-baby-teethers-set',
    description: 'Easy-to-grip silicone baby teethers made of 100% food-grade silicone. Textured surface relieves sore gums during teething periods.',
    price: 800,
    purchasePrice: 400,
    stock: 90,
    sku: 'CM-BABY-SBT10',
    categorySlug: 'baby-care-essentials',
    images: ['/assets/images/products/baby_teethers.webp'],
    tags: ['teether', 'toy', 'silicone', 'baby'],
    attributes: [{ key: 'Material', value: 'Food-grade Silicone' }, { key: 'Ages', value: '3+ months' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: true
  },

  // Category 3: Baby Feeding & Nutrition
  {
    name: 'Anti-Colic Glass Feeding Bottles Set',
    slug: 'anti-colic-glass-feeding-bottles-set',
    description: 'Set of two anti-colic borosilicate glass feeding bottles. Wide neck for easy cleaning, featuring slow-flow active silicone nipples.',
    price: 2100,
    salePrice: 1750,
    discountRate: 17,
    purchasePrice: 1100,
    stock: 75,
    sku: 'CM-FEED-GFB11',
    categorySlug: 'baby-feeding-nutrition',
    images: ['/assets/images/products/feeding_bottles.webp'],
    tags: ['feeding', 'bottle', 'glass', 'anti-colic'],
    attributes: [{ key: 'Sizes Included', value: '150ml & 240ml' }, { key: 'Material', value: 'Borosilicate Glass' }],
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: '2-in-1 Smart Baby Food Processor',
    slug: '2-in-1-smart-baby-food-processor',
    description: 'Multifunctional steam-and-blend baby food maker. Prepares healthy purees in minutes with an intuitive automatic timer.',
    price: 6500,
    purchasePrice: 4200,
    stock: 20,
    sku: 'CM-FEED-BFM12',
    categorySlug: 'baby-feeding-nutrition',
    images: ['/assets/images/products/baby_food_maker.webp'],
    tags: ['food maker', 'blender', 'steamer', 'feeding'],
    attributes: [{ key: 'Functions', value: 'Steam, Blend' }, { key: 'Capacity', value: '600ml' }],
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: true
  },
  {
    name: 'Toddler Silicone Suction Feeding Set',
    slug: 'toddler-silicone-suction-feeding-set',
    description: '4-piece silicone baby feeding plate set. Includes divided suction plate, suction bowl, straw cup, and soft training spoon.',
    price: 1950,
    salePrice: 1600,
    discountRate: 18,
    purchasePrice: 1100,
    stock: 55,
    sku: 'CM-FEED-SFS13',
    categorySlug: 'baby-feeding-nutrition',
    images: ['/assets/images/products/suction_feeding_set.webp'],
    tags: ['feeding', 'plate', 'silicone', 'baby'],
    attributes: [{ key: 'Material', value: 'Food-grade Silicone' }, { key: 'Set Items', value: '4 Pieces' }],
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: true
  },
  {
    name: 'Convertible Wooden Baby High Chair',
    slug: 'convertible-wooden-baby-high-chair',
    description: 'Stylish convertible high chair with stable wooden legs, double food tray, and harness system. Easily converts into a toddler play chair.',
    price: 5500,
    salePrice: 4800,
    discountRate: 13,
    purchasePrice: 3200,
    stock: 15,
    sku: 'CM-FEED-BHC14',
    categorySlug: 'baby-feeding-nutrition',
    images: ['/assets/images/products/baby_high_chair.webp'],
    tags: ['high chair', 'furniture', 'feeding', 'baby'],
    attributes: [{ key: 'Material', value: 'Beech Wood & PP' }, { key: 'Weight Limit', value: '25kg' }],
    isFeatured: true,
    isNewArrival: false,
    isFlashSale: false
  },
  {
    name: 'Insulated Travel Milk Bottle Bag',
    slug: 'insulated-travel-milk-bottle-bag',
    description: 'Double-layer thermal insulated travel bag for milk bottles. Keeps breast milk and baby food warm or cool for up to 6 hours.',
    price: 1100,
    purchasePrice: 650,
    stock: 40,
    sku: 'CM-FEED-IBB15',
    categorySlug: 'baby-feeding-nutrition',
    images: ['/assets/images/products/insulated_bottle_bag.webp'],
    tags: ['travel', 'bag', 'insulated', 'feeding'],
    attributes: [{ key: 'Capacity', value: 'Holds up to 2 large bottles' }, { key: 'Material', value: 'Waterproof Nylon' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: true
  },

  // Category 4: Smart Kitchen Appliances
  {
    name: 'Touchscreen Digital Air Fryer',
    slug: 'touchscreen-digital-air-fryer',
    description: 'Smart touchscreen air fryer with 8 pre-programmed presets. Oil-free convection frying mechanism makes healthy cooking quick and easy.',
    price: 9500,
    salePrice: 7900,
    discountRate: 17,
    purchasePrice: 5500,
    stock: 25,
    sku: 'CM-APP-DAF16',
    categorySlug: 'kitchen-appliances',
    images: ['/assets/images/products/digital_air_fryer.webp'],
    tags: ['kitchen', 'appliances', 'air fryer', 'cooking'],
    attributes: [{ key: 'Capacity', value: '5.5L' }, { key: 'Power', value: '1700W' }],
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: 'High-Power Kitchen Glass Blender',
    slug: 'high-power-kitchen-glass-blender',
    description: 'Professional high-power blender with thick glass jar and pulse dial. Easily crushes ice, fruits, and vegetables for daily smoothies.',
    price: 4200,
    purchasePrice: 2600,
    stock: 35,
    sku: 'CM-APP-HPB17',
    categorySlug: 'kitchen-appliances',
    images: ['/assets/images/products/glass_blender.webp'],
    tags: ['kitchen', 'blender', 'appliances', 'smoothie'],
    attributes: [{ key: 'Power', value: '1000W' }, { key: 'Jar Capacity', value: '1.5L' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: true
  },
  {
    name: 'Smart Gooseneck Electric Kettle',
    slug: 'smart-gooseneck-electric-kettle',
    description: 'Elegant matte-black gooseneck kettle with precise temperature control base. Perfect for brewing pour-over coffee or various tea types.',
    price: 3800,
    salePrice: 3200,
    discountRate: 16,
    purchasePrice: 2200,
    stock: 30,
    sku: 'CM-APP-GEK18',
    categorySlug: 'kitchen-appliances',
    images: ['/assets/images/products/electric_kettle.webp'],
    tags: ['kettle', 'appliances', 'kitchen', 'brewing'],
    attributes: [{ key: 'Material', value: '304 Stainless Steel' }, { key: 'Capacity', value: '0.8L' }],
    isFeatured: true,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: 'Smart 2-Slice Bread Toaster',
    slug: 'smart-2-slice-bread-toaster',
    description: 'Stainless steel 2-slice smart toaster with an LCD timer display and browning dials. Features auto-centering guides for perfect toast.',
    price: 2900,
    purchasePrice: 1800,
    stock: 40,
    sku: 'CM-APP-SBT19',
    categorySlug: 'kitchen-appliances',
    images: ['/assets/images/products/bread_toaster.webp'],
    tags: ['toaster', 'kitchen', 'appliances', 'breakfast'],
    attributes: [{ key: 'Material', value: 'Stainless Steel' }, { key: 'Slots', value: '2 Wide Slots' }],
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: 'Mini Electric Food Chopper & Mincer',
    slug: 'mini-electric-food-chopper-mincer',
    description: 'Compact electric food processor for quick chopping of onions, garlic, meat, and baby foods. Features 4 sharp stainless steel blades.',
    price: 1800,
    purchasePrice: 1100,
    stock: 60,
    sku: 'CM-APP-MFC20',
    categorySlug: 'kitchen-appliances',
    images: ['/assets/images/products/food_chopper.webp'],
    tags: ['chopper', 'kitchen', 'appliances', 'processor'],
    attributes: [{ key: 'Bowl Capacity', value: '2L' }, { key: 'Material', value: 'Glass Bowl & Steel Blades' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false
  },

  // Category 5: Home Comfort & Cleaning
  {
    name: 'Smart HEPA Air Purifier',
    slug: 'smart-hepa-air-purifier',
    description: 'Ultra-quiet smart home air purifier with H13 true HEPA filter. Removes 99.97% of allergens, smoke, mold, and dust from indoor air.',
    price: 12500,
    purchasePrice: 8500,
    stock: 15,
    sku: 'CM-COM-HAP21',
    categorySlug: 'home-comfort-cleaning',
    images: ['/assets/images/products/air_purifier.webp'],
    tags: ['comfort', 'air purifier', 'appliances', 'hepa'],
    attributes: [{ key: 'Filter Type', value: 'H13 True HEPA' }, { key: 'Coverage', value: 'Up to 300 sq ft' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false
  },
  {
    name: 'Smart Robotic Vacuum Cleaner',
    slug: 'smart-robotic-vacuum-cleaner',
    description: 'Intelligent mapping robotic vacuum cleaner with self-charging capabilities. Strong suction easily picks up dust and pet hair.',
    price: 18500,
    salePrice: 15500,
    discountRate: 16,
    purchasePrice: 11000,
    stock: 12,
    sku: 'CM-COM-RVC22',
    categorySlug: 'home-comfort-cleaning',
    images: ['/assets/images/products/robot_vacuum.webp'],
    tags: ['cleaning', 'vacuum', 'robotic', 'home'],
    attributes: [{ key: 'Suction Power', value: '2500Pa' }, { key: 'Runtime', value: '120 Minutes' }],
    isFeatured: false,
    isNewArrival: true,
    isFlashSale: false
  },
  {
    name: 'Cool Mist Ultrasonic Humidifier',
    slug: 'cool-mist-ultrasonic-humidifier',
    description: 'Quiet ultrasonic cool mist humidifier. Features a large 3L top-fill water tank, auto shut-off, and relaxing warm night light.',
    price: 2800,
    purchasePrice: 1600,
    stock: 45,
    sku: 'CM-COM-CMH23',
    categorySlug: 'home-comfort-cleaning',
    images: ['/assets/images/products/mist_humidifier.webp'],
    tags: ['comfort', 'humidifier', 'home', 'wellness'],
    attributes: [{ key: 'Capacity', value: '3.0 Liters' }, { key: 'Mist Output', value: '250 ml/h' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false
  },
  {
    name: 'Portable Handheld Garment Steamer',
    slug: 'portable-handheld-garment-steamer',
    description: 'Quick heating portable clothes fabric steamer. Gently and effectively removes wrinkles from suits, shirts, and delicate fabrics.',
    price: 2500,
    purchasePrice: 1500,
    stock: 50,
    sku: 'CM-COM-HGS24',
    categorySlug: 'home-comfort-cleaning',
    images: ['/assets/images/products/garment_steamer.webp'],
    tags: ['clothing care', 'steamer', 'travel', 'home'],
    attributes: [{ key: 'Heat-up Time', value: '30 Seconds' }, { key: 'Water Tank', value: '150ml' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false
  },
  {
    name: 'Rechargeable Fabric Shaver & Lint Remover',
    slug: 'rechargeable-fabric-shaver-lint-remover',
    description: 'Ergonomic, rechargeable lint remover to restore sweaters, sofas, blankets, and woolens. Safe dual lock mechanism protects fabric.',
    price: 1200,
    purchasePrice: 700,
    stock: 75,
    sku: 'CM-COM-RFS25',
    categorySlug: 'home-comfort-cleaning',
    images: ['/assets/images/products/fabric_shaver.webp'],
    tags: ['clothing care', 'lint remover', 'shaver', 'home'],
    attributes: [{ key: 'Blade Type', value: '3-Blade Stainless Steel' }, { key: 'Battery Life', value: '60 Minutes' }],
    isFeatured: false,
    isNewArrival: false,
    isFlashSale: false
  }
];

async function seed() {
  try {
    try {
      await mongoose.connect(mongodbUri);
    } catch (connErr) {
      console.log('SRV connection failed, trying direct connection fallback...');
      const directUri = 'mongodb://CareMom:xI2QuBaFZsYQ5vRD@ac-jrowhop-shard-00-00.e5n1hnl.mongodb.net:27017,ac-jrowhop-shard-00-01.e5n1hnl.mongodb.net:27017,ac-jrowhop-shard-00-02.e5n1hnl.mongodb.net:27017/CareMom?ssl=true&authSource=admin';
      await mongoose.connect(directUri);
    }
    console.log('Connected to MongoDB successfully.');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products.`);

    // Query all categories
    const categoriesList = await Category.find({});
    console.log(`Fetched ${categoriesList.length} categories from DB.`);

    const categoryMap = {};
    categoriesList.forEach(c => {
      categoryMap[c.slug] = c._id;
    });

    // Prepare products with proper Category ObjectIds
    const finalProducts = productsData.map(p => {
      const categoryId = categoryMap[p.categorySlug];
      if (!categoryId) {
        throw new Error(`Category with slug "${p.categorySlug}" not found in DB! Seed categories first.`);
      }
      const pCopy = { ...p };
      pCopy.categories = [categoryId];
      delete pCopy.categorySlug;
      return pCopy;
    });

    // Insert new products
    const insertResult = await Product.insertMany(finalProducts);
    console.log(`Seeded ${insertResult.length} products successfully:`);
    insertResult.forEach((prod, i) => {
      console.log(`[Product ${i+1}] Name: "${prod.name}", SKU: "${prod.sku}"`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
