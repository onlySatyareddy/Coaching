const Result = require('../models/Result');

// Get all results
const getResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, student, course, exam, featured, isActive = true } = req.query;
    
    const query = { isActive };
    if (student) query.student = student;
    if (course) query.course = course;
    if (exam) query.exam = { $regex: exam, $options: 'i' };
    if (featured === 'true') query.featured = true;

    const results = await Result.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ featured: -1, rank: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Result.countDocuments(query);

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results'
    });
  }
};

// Get result by ID
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title');
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.json({
      success: true,
      data: { result }
    });
  } catch (error) {
    console.error('Get result by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch result'
    });
  }
};

// Create new result
const createResult = async (req, res) => {
  try {
    const result = await Result.create(req.body);
    
    // Populate the result for response
    await result.populate('student', 'name email');
    await result.populate('course', 'title');
    
    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: { result }
    });
  } catch (error) {
    console.error('Create result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create result',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update result
const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'name email')
     .populate('course', 'title');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.json({
      success: true,
      message: 'Result updated successfully',
      data: { result }
    });
  } catch (error) {
    console.error('Update result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update result',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete result
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete result'
    });
  }
};

// Get featured results/toppers for public display
const getFeaturedResults = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const results = await Result.find({ 
      isActive: true, 
      featured: true 
    })
    .populate('student', 'name')
    .populate('course', 'title')
    .sort({ rank: 1, percentage: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { results }
    });
  } catch (error) {
    console.error('Get featured results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured results'
    });
  }
};

// Get results by student
const getResultsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    const results = await Result.find({ 
      student: studentId, 
      isActive: true 
    })
    .populate('course', 'title')
    .sort({ examDate: -1 });

    res.json({
      success: true,
      data: { results }
    });
  } catch (error) {
    console.error('Get results by student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student results'
    });
  }
};

module.exports = {
  getResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
  getFeaturedResults,
  getResultsByStudent
};
