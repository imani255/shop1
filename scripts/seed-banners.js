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
  // Fallback if env file doesn't parse correctly
  mongodbUri = 'mongodb+srv://caremombd:S4Epscw0SOkd5ZtG@cluster0.e5n1hnl.mongodb.net/caremombd';
}

console.log('Connecting to MongoDB...');

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    primaryBtnText: { type: String },
    primaryBtnLink: { type: String },
    secondaryBtnText: { type: String },
    secondaryBtnLink: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

const banners = [
  {
    title: 'Pure Baby Care',
    image: '/assets/images/Banner/Pure Baby Care.webp',
    link: 'https://rad-flan-e903ce.netlify.app/shop',
    primaryBtnText: 'Shop Now',
    primaryBtnLink: 'https://rad-flan-e903ce.netlify.app/shop',
    secondaryBtnText: 'Order on Call',
    secondaryBtnLink: 'https://wa.me/8801866128382',
    order: 1,
    isActive: true,
  },
  {
    title: 'Smart Kitchen Gear',
    image: '/assets/images/Banner/Smart Kitchen Gear.webp',
    link: 'https://rad-flan-e903ce.netlify.app/shop',
    primaryBtnText: 'Explore Shop',
    primaryBtnLink: 'https://rad-flan-e903ce.netlify.app/shop',
    secondaryBtnText: 'Quick Call',
    secondaryBtnLink: 'https://wa.me/8801866128382',
    order: 2,
    isActive: true,
  },
  {
    title: 'Motherhood & Wellness',
    image: '/assets/images/Banner/Motherhood & Wellness.webp',
    link: 'https://rad-flan-e903ce.netlify.app/shop',
    primaryBtnText: 'Order Now',
    primaryBtnLink: 'https://rad-flan-e903ce.netlify.app/shop',
    secondaryBtnText: 'Call to Order',
    secondaryBtnLink: 'https://wa.me/8801866128382',
    order: 3,
    isActive: true,
  },
  {
    title: 'Modern Smart Home',
    image: '/assets/images/Banner/Modern Smart Home.webp',
    link: 'https://rad-flan-e903ce.netlify.app/shop',
    primaryBtnText: 'Shop Wellness',
    primaryBtnLink: 'https://rad-flan-e903ce.netlify.app/shop',
    secondaryBtnText: 'Contact Sales',
    secondaryBtnLink: 'https://wa.me/8801866128382',
    order: 4,
    isActive: true,
  },
  {
    title: 'Baby Play & Safety',
    image: '/assets/images/Banner/Baby Play & Safety.webp',
    link: 'https://rad-flan-e903ce.netlify.app/shop',
    primaryBtnText: 'Explore Strollers',
    primaryBtnLink: 'https://rad-flan-e903ce.netlify.app/shop',
    secondaryBtnText: 'Quick Call',
    secondaryBtnLink: 'https://wa.me/8801866128382',
    order: 5,
    isActive: true,
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

    // Clear existing banners
    const deleteResult = await Banner.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing banners.`);

    // Insert new banners
    const insertResult = await Banner.insertMany(banners);
    console.log(`Seeded ${insertResult.length} banners successfully:`);
    insertResult.forEach((b, i) => {
      console.log(`[Banner ${i + 1}] Title: "${b.title}", Image: "${b.image}"`);
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
