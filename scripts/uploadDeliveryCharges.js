// Script to upload delivery charges to database
// Run this script to populate the delivery charges

import deliveryCharges from '../data/deliveryCharges';

async function uploadDeliveryCharges() {
  try {
    console.log('Starting delivery charges upload...');
    
    const response = await fetch('http://localhost:3003/api/v1/delivery-charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deliveryCharges)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Delivery charges uploaded successfully!');
      console.log(`📊 Uploaded ${result.data.length} delivery charges`);
    } else {
      console.error('❌ Failed to upload delivery charges:', result.message);
    }
  } catch (error) {
    console.error('❌ Error uploading delivery charges:', error);
  }
}

// Run the upload
uploadDeliveryCharges();
