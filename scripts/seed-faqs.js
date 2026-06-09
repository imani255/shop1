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

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

const faqs = [
  {
    question: 'What is your return policy for baby care products and appliances?',
    answer: 'We offer a 7-day easy return policy for all unused products in their original packaging. For home appliances, we also provide official brand warranty claims. Please note that for hygiene reasons, personal baby care items like feeding nipples or breast pumps cannot be returned once opened.',
    order: 1,
    isActive: true,
  },
  {
    question: 'Are the baby products you sell safe and certified?',
    answer: 'Yes, absolutely. All our baby products, feeding gear, and skincare items are sourced directly from certified manufacturers and are 100% BPA-free, non-toxic, and dermatologically tested for sensitive infant skin.',
    order: 2,
    isActive: true,
  },
  {
    question: 'Do you provide home delivery all over Bangladesh?',
    answer: 'Yes, we deliver nationwide. Inside Dhaka, delivery takes 24 to 48 hours, and outside Dhaka, it takes 3 to 5 business days. We offer both Cash on Delivery (COD) and secure online payment options.',
    order: 3,
    isActive: true,
  },
  {
    question: 'How do I claim the warranty for home appliances purchased from CareMom?',
    answer: 'All smart home appliances come with their official brand warranty cards inside the box. You can claim the warranty directly at any authorized brand service center, or you can contact our support team and we will assist you with the process.',
    order: 4,
    isActive: true,
  },
  {
    question: 'Can I track my order once it is shipped?',
    answer: 'Yes, once your order is dispatched, you will receive an SMS containing a tracking link and courier details. You can also monitor your order status directly from the "My Orders" section of your dashboard.',
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

    // Clear existing FAQs
    const deleteResult = await FAQ.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing FAQs.`);

    // Insert new FAQs
    const insertResult = await FAQ.insertMany(faqs);
    console.log(`Seeded ${insertResult.length} FAQs successfully:`);
    insertResult.forEach((f, i) => {
      console.log(`[FAQ ${i+1}] Question: "${f.question}"`);
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
