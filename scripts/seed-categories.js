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
  mongodbUri = 'mongodb+srv://CareMom:xI2QuBaFZsYQ5vRD@cluster0.e5n1hnl.mongodb.net/CareMom';
}

console.log('Connecting to MongoDB...');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    image: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const categories = [
  {
    name: 'Motherhood & Maternity',
    slug: 'motherhood-maternity',
    image: '/assets/images/cagetory/Motherhood & Maternity.webp',
    isActive: true,
  },
  {
    name: 'Baby Care & Essentials',
    slug: 'baby-care-essentials',
    image: '/assets/images/cagetory/Baby Care & Essentials.webp',
    isActive: true,
  },
  {
    name: 'Baby Feeding & Nutrition',
    slug: 'baby-feeding-nutrition',
    image: '/assets/images/cagetory/Baby Feeding & Nutrition.webp',
    isActive: true,
  },
  {
    name: 'Smart Kitchen Appliances',
    slug: 'kitchen-appliances',
    image: '/assets/images/cagetory/Smart Kitchen Appliances.webp',
    isActive: true,
  },
  {
    name: 'Home Comfort & Cleaning',
    slug: 'home-comfort-cleaning',
    image: '/assets/images/cagetory/Home Comfort & Cleaning.webp',
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

    // Clear existing categories
    const deleteResult = await Category.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing categories.`);

    // Insert new categories
    const insertResult = await Category.insertMany(categories);
    console.log(`Seeded ${insertResult.length} categories successfully:`);
    insertResult.forEach((c, i) => {
      console.log(`[Category ${i+1}] Name: "${c.name}", Slug: "${c.slug}", Image: "${c.image}"`);
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
