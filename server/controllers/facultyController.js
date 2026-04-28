const Faculty = require('../models/Faculty');

// Get all faculty
const getFaculty = async (req, res) => {
  try {
    const { featured, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isActive: true };

    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const faculty = await Faculty.find(query)
      .populate('courses', 'title thumbnail')
      .sort({ isFeatured: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Faculty.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        faculty,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get faculty'
    });
  }
};

// Get single faculty
const getFacultyMember = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('courses', 'title thumbnail description price');

    if (!faculty || !faculty.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        faculty
      }
    });
  } catch (error) {
    console.error('Get faculty member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get faculty member'
    });
  }
};

// Create faculty (Admin only)
const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);

    const populatedFaculty = await Faculty.findById(faculty._id)
      .populate('courses', 'title thumbnail');

    res.status(201).json({
      success: true,
      message: 'Faculty member created successfully',
      data: {
        faculty: populatedFaculty
      }
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create faculty member',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update faculty (Admin only)
const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('courses', 'title thumbnail');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully',
      data: {
        faculty
      }
    });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty member',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete faculty (Admin only)
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    await Faculty.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty member'
    });
  }
};

// Get featured faculty
const getFeaturedFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true, isFeatured: true })
      .populate('courses', 'title thumbnail')
      .sort({ name: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        faculty
      }
    });
  } catch (error) {
    console.error('Get featured faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured faculty'
    });
  }
};

module.exports = {
  getFaculty,
  getFacultyMember,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFeaturedFaculty
};
