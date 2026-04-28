const Testimonial = require('../models/Testimonial');

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 10, featured, isActive = true } = req.query;
    
    const query = { isActive };
    if (featured === 'true') {
      query.featured = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Testimonial.countDocuments(query);

    res.json({
      success: true,
      data: {
        testimonials,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};

// Get testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: { testimonial }
    });
  } catch (error) {
    console.error('Get testimonial by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial'
    });
  }
};

// Create new testimonial
const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: { testimonial }
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: { testimonial }
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};

// Get featured testimonials for public display
const getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      isActive: true, 
      featured: true 
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      data: { testimonials }
    });
  } catch (error) {
    console.error('Get featured testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured testimonials'
    });
  }
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials
};
