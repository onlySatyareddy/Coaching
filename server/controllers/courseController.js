const Course = require('../models/Course');
const Faculty = require('../models/Faculty');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      difficulty,
      search,
      featured,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (difficulty) query.difficulty = difficulty;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const courses = await Course.find(query)
      .populate('faculty', 'name qualification image')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get courses'
    });
  }
};

// Get single course
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('faculty', 'name qualification experience image bio')
      .populate('reviews.student', 'name');

    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course'
    });
  }
};

// Create course (Admin only)
const createCourse = async (req, res) => {
  try {
    console.log('Creating course with data:', JSON.stringify(req.body, null, 2));
    const course = await Course.create(req.body);
    console.log('Course created successfully:', course._id);

    // Update faculty courses - only if faculty array is provided and not empty
    if (req.body.faculty && Array.isArray(req.body.faculty) && req.body.faculty.length > 0) {
      try {
        await Faculty.updateMany(
          { _id: { $in: req.body.faculty } },
          { $push: { courses: course._id } }
        );
      } catch (facultyError) {
        console.error('Faculty update error:', facultyError);
        // Don't fail the course creation if faculty update fails
      }
    }

    const populatedCourse = await Course.findById(course._id)
      .populate('faculty', 'name qualification image');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        course: populatedCourse
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Update faculty courses if faculty changed
    if (req.body.faculty) {
      // Remove course from old faculty
      await Faculty.updateMany(
        { courses: course._id },
        { $pull: { courses: course._id } }
      );

      // Add course to new faculty
      await Faculty.updateMany(
        { _id: { $in: req.body.faculty } },
        { $push: { courses: course._id } }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('faculty', 'name qualification image');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        course: updatedCourse
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove course from faculty
    await Faculty.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course'
    });
  }
};

// Add review to course
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      review => review.student.toString() === req.user.id
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.date = new Date();
    } else {
      // Add new review
      course.reviews.push({
        student: req.user.id,
        rating,
        comment
      });
    }

    // Calculate average rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = totalRating / course.reviews.length;

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate('reviews.student', 'name');

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: {
        course: updatedCourse
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
};

// Get featured courses
const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true, featured: true })
      .populate('faculty', 'name qualification image')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        courses
      }
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured courses'
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addReview,
  getFeaturedCourses
};
