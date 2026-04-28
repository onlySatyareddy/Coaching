const Batch = require('../models/Batch');

// Get all batches
const getBatches = async (req, res) => {
  try {
    const { page = 1, limit = 10, course, faculty, batchType, status, isActive = true } = req.query;
    
    const query = { isActive };
    if (course) query.course = course;
    if (faculty) query.faculty = { $in: [faculty] };
    if (batchType) query.batchType = batchType;
    if (status) query.status = status;

    const batches = await Batch.find(query)
      .populate('course', 'title')
      .populate('faculty', 'name specialization')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Batch.countDocuments(query);

    res.json({
      success: true,
      data: {
        batches,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches'
    });
  }
};

// Get batch by ID
const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course', 'title description')
      .populate('faculty', 'name qualification specialization experience');
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    res.json({
      success: true,
      data: { batch }
    });
  } catch (error) {
    console.error('Get batch by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch'
    });
  }
};

// Create new batch
const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    
    // Populate the batch for response
    await batch.populate('course', 'title');
    await batch.populate('faculty', 'name specialization');
    
    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: { batch }
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create batch',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update batch
const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'title description')
     .populate('faculty', 'name qualification specialization experience');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    res.json({
      success: true,
      message: 'Batch updated successfully',
      data: { batch }
    });
  } catch (error) {
    console.error('Update batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update batch',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete batch
const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    res.json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error('Delete batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete batch'
    });
  }
};

// Get batches by course
const getBatchesByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const batches = await Batch.find({ 
      course: courseId, 
      isActive: true 
    })
    .populate('faculty', 'name specialization experience')
    .sort({ startDate: 1 });

    res.json({
      success: true,
      data: { batches }
    });
  } catch (error) {
    console.error('Get batches by course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course batches'
    });
  }
};

// Get available batches (with space for new students)
const getAvailableBatches = async (req, res) => {
  try {
    const { course } = req.query;
    
    const query = { 
      isActive: true, 
      status: { $in: ['upcoming', 'active'] },
      $expr: { $lt: ['$currentStudents', '$maxStudents'] }
    };
    
    if (course) query.course = course;

    const batches = await Batch.find(query)
      .populate('course', 'title')
      .populate('faculty', 'name specialization')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: { batches }
    });
  } catch (error) {
    console.error('Get available batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available batches'
    });
  }
};

// Update batch student count
const updateBatchStudentCount = async (req, res) => {
  try {
    const { increment = 1 } = req.body;
    
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $inc: { currentStudents: increment } },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check if batch is now full
    if (batch.currentStudents >= batch.maxStudents) {
      batch.status = 'completed';
      await batch.save();
    }

    res.json({
      success: true,
      message: 'Batch student count updated successfully',
      data: { batch }
    });
  } catch (error) {
    console.error('Update batch student count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update batch student count',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchesByCourse,
  getAvailableBatches,
  updateBatchStudentCount
};
