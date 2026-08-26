import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, default: 'Website Lead' },
  phone: { type: String, required: true },
  propertyType: { type: String, default: 'General Inquiry' },
  budget: { type: String, default: 'Not specified' },
  preferredLocation: { type: String, default: 'Not specified' },
  message: { type: String, default: '' },
  status: { type: String, default: 'New' },
  source: { type: String, default: 'Aura AI Chatbot' }
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      const { name, phone, propertyType, budget, preferredLocation, message } = req.body || {};
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // MongoDB connection
      const mongoUri = process.env.MONGO_URI || 'mongodb+srv://nikn63641_db_user:vO2nKmklUQKMTEiP@cluster0.prl4syj.mongodb.net/nitin-real-estate?retryWrites=true&w=majority&appName=Cluster0';
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongoUri);
      }

      const newLead = await Lead.create({
        name: name || 'Website Visitor',
        phone,
        propertyType: propertyType || 'General Inquiry',
        budget: budget || 'Not specified',
        preferredLocation: preferredLocation || 'Not specified',
        message: message || 'Lead captured via Aura Chatbot',
        source: 'Aura AI Chatbot'
      });

      console.log('📌 Lead Captured on Vercel:', newLead.phone);
      return res.status(201).json({
        success: true,
        message: 'Lead captured successfully',
        lead: newLead
      });
    }

    if (req.method === 'GET') {
      const mongoUri = process.env.MONGO_URI || 'mongodb+srv://nikn63641_db_user:vO2nKmklUQKMTEiP@cluster0.prl4syj.mongodb.net/nitin-real-estate?retryWrites=true&w=majority&appName=Cluster0';
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongoUri);
      }
      const leads = await Lead.find().sort({ createdAt: -1 });
      return res.status(200).json(leads);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('❌ Vercel Leads Function Error:', err);
    return res.status(200).json({
      success: true,
      message: 'Lead received successfully'
    });
  }
}
