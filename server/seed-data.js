const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Testimonial = require('./models/Testimonial');
const Result = require('./models/Result');
const Order = require('./models/Order');
const Batch = require('./models/Batch');
const User = require('./models/User');
const Course = require('./models/Course');
const Faculty = require('./models/Faculty');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Testimonial.deleteMany({});
    await Result.deleteMany({});
    await Order.deleteMany({});
    await Batch.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Get existing data for references
    const adminUser = await User.findOne({ role: 'admin' });
    const courses = await Course.find();
    const faculty = await Faculty.find();

    // Create sample testimonials
    const testimonials = [
      {
        name: 'Rahul Sharma',
        role: 'JEE Advanced AIR 245',
        content: 'CODEX Center provided me with the perfect guidance and support to crack JEE. The faculty is amazing!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        featured: true
      },
      {
        name: 'Priya Patel',
        role: 'NEET AIR 156',
        content: 'The comprehensive study material and regular tests helped me achieve my dream of becoming a doctor.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        featured: true
      },
      {
        name: 'Amit Kumar',
        role: 'SSC CGL Selected',
        content: 'Excellent coaching center with experienced faculty. The mock tests were very helpful.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        featured: false
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('✅ Created sample testimonials');

    // Create sample results (if we have courses and students)
    if (courses.length > 0 && adminUser) {
      const results = [
        {
          student: adminUser._id,
          course: courses[0]._id,
          exam: 'JEE Advanced 2024',
          score: 245,
          rank: 245,
          totalMarks: 360,
          percentage: 68,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          featured: true,
          examDate: new Date('2024-06-04')
        }
      ];

      await Result.insertMany(results);
      console.log('✅ Created sample results');
    }

    // Create sample orders
    if (courses.length > 0 && adminUser) {
      const orders = [
        {
          student: adminUser._id,
          course: courses[0]._id,
          amount: 9999,
          discountAmount: 1000,
          paymentStatus: 'completed',
          paymentMethod: 'online',
          transactionId: 'TXN123456789',
          paymentDate: new Date(),
          enrollmentStatus: 'confirmed'
        }
      ];

      await Order.insertMany(orders);
      console.log('✅ Created sample orders');
    }

    // Create sample batches
    if (courses.length > 0 && faculty.length > 0) {
      const batches = [
        {
          name: 'JEE Advanced Batch 2024',
          course: courses[0]._id,
          faculty: [faculty[0]._id],
          schedule: [
            {
              day: 'Monday',
              startTime: '09:00',
              endTime: '12:00'
            },
            {
              day: 'Wednesday',
              startTime: '09:00',
              endTime: '12:00'
            },
            {
              day: 'Friday',
              startTime: '09:00',
              endTime: '12:00'
            }
          ],
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-12-15'),
          maxStudents: 30,
          currentStudents: 15,
          batchType: 'regular',
          status: 'active',
          price: 9999,
          description: 'Comprehensive JEE Advanced preparation batch'
        }
      ];

      await Batch.insertMany(batches);
      console.log('✅ Created sample batches');
    }

    console.log('\n🎉 All sample data created successfully!');
    console.log('📊 Summary:');
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Results: ${courses.length > 0 ? 1 : 0}`);
    console.log(`   - Orders: ${courses.length > 0 ? 1 : 0}`);
    console.log(`   - Batches: ${courses.length > 0 && faculty.length > 0 ? 1 : 0}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
