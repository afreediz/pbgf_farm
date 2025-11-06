const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// static serving
const path = require("path");
app.use(express.static(path.join(__dirname, "./build")));

// Mock Farmer Database
const farmers = [
  { name: 'John Smith', email: 'pbfgmarketplace@gmail.com', product: 'potato' },
  { name: 'Maria Garcia', email: 'pbfgmarketplace@gmail.com', product: 'tomato' },
  { name: 'David Chen', email: 'pbfgmarketplace@gmail.com', product: 'tomato' }
];

// In-memory storage for requirements
const requirements = [];

// Email transporter configuration
let transporter = null;

if (process.env.SEND_EMAIL === 'true') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Verify transporter
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email configuration error:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
}

// Helper function to match farmers based on product
const matchFarmers = (productName) => {
  const normalizedProduct = productName.toLowerCase();
  return farmers.filter(farmer => 
    normalizedProduct.includes(farmer.product.toLowerCase())
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to send email
const sendEmail = async (farmer, requirement) => {
  const emailContent = `Hi ${farmer.name},

A buyer needs ${requirement.product} (${requirement.quantity}kg) by ${formatDate(requirement.deliveryDate)}.

Notes: ${requirement.notes || 'No additional notes'}

Please contact the buyer if you can fulfill this requirement.

Best regards,
PBF Marketplace`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: farmer.email,
    subject: `New Product Requirement: ${requirement.product}`,
    text: emailContent
  };

  if (process.env.SEND_EMAIL === 'true' && transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✓ Email sent to ${farmer.name} (${farmer.email})`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to send email to ${farmer.name}:`, error.message);
      return false;
    }
  } else {
    // Log email content instead of sending
    console.log('\n' + '='.repeat(60));
    console.log(`EMAIL TO: ${farmer.name} (${farmer.email})`);
    console.log('='.repeat(60));
    console.log(emailContent);
    console.log('='.repeat(60) + '\n');
    return true;
  }
};

// API Routes

// POST /api/requirements - Create new requirement
app.post('/api/requirements', async (req, res) => {
  try {
    const { product, quantity, deliveryDate, notes } = req.body;

    // Validation
    if (!product || !quantity || !deliveryDate) {
      return res.status(400).json({
        message: 'Missing required fields: product, quantity, and deliveryDate are required'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: 'Quantity must be greater than 0'
      });
    }

    // Create requirement object
    const requirement = {
      id: requirements.length + 1,
      product: product.trim(),
      quantity: parseFloat(quantity),
      deliveryDate,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    // Store requirement
    requirements.push(requirement);

    // Match farmers
    const matchedFarmers = matchFarmers(product);

    if (matchedFarmers.length === 0) {
      return res.status(200).json({
        message: `No farmers found growing "${product}". Your requirement has been saved and we'll notify you when matching farmers are available.`,
        notifiedFarmers: [],
        requirement
      });
    }

    // Send notifications to matched farmers
    const notificationPromises = matchedFarmers.map(farmer => 
      sendEmail(farmer, requirement)
    );

    await Promise.all(notificationPromises);

    // Return success response
    res.status(200).json({
      message: `Successfully notified ${matchedFarmers.length} farmer${matchedFarmers.length > 1 ? 's' : ''} about your requirement!`,
      notifiedFarmers: matchedFarmers.map(f => ({ name: f.name, email: f.email })),
      requirement
    });

  } catch (error) {
    console.error('Error processing requirement:', error);
    res.status(500).json({
      message: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/requirements - Get all requirements
app.get('/api/requirements', (req, res) => {
  res.json({
    count: requirements.length,
    requirements
  });
});

// GET /api/farmers - Get all farmers
app.get('/api/farmers', (req, res) => {
  res.json({
    count: farmers.length,
    farmers
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    emailEnabled: process.env.SEND_EMAIL === 'true',
    timestamp: new Date().toISOString() 
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌾 PBF Marketplace Backend`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Email notifications: ${process.env.SEND_EMAIL === 'true' ? 'ENABLED ✓' : 'DISABLED (Console logging)'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(60)}\n`);
});