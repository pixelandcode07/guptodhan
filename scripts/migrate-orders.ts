import dbConnect from '@/lib/db';
import { OrderModel } from '@/lib/modules/product-order/order/order.model';

async function migrateOrders() {
  try {
    // ✅ আপনার db.ts file use করবে connection এর জন্য
    await dbConnect();
    console.log('✅ Connected to database');

    // Add transactionId field to existing orders
    const result = await OrderModel.updateMany(
      { transactionId: { $exists: false } },
      { $set: { transactionId: null } }
    );

    console.log(`✅ Updated ${result.modifiedCount} orders`);

    // Create indexes
    await OrderModel.collection.createIndex({ transactionId: 1 });
    console.log('✅ Created transactionId index');

    await OrderModel.collection.createIndex({ 
      transactionId: 1, 
      paymentStatus: 1 
    });
    console.log('✅ Created compound index');

    // Verify
    const count = await OrderModel.countDocuments({ 
      transactionId: { $exists: true } 
    });
    console.log(`✅ Total orders with transactionId field: ${count}`);

    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateOrders();