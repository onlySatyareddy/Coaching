const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  role: Joi.string().valid('student', 'admin').default('student')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Course validation schemas
const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string().valid('JEE', 'NEET', 'SSC', 'Foundation', 'Board Exams').required(),
  price: Joi.number().min(0).required(),
  originalPrice: Joi.number().min(0).optional(),
  duration: Joi.string().required(),
  syllabus: Joi.array().items(Joi.object({
    topic: Joi.string().required(),
    chapters: Joi.array().items(Joi.string())
  })).required(),
  batchTimings: Joi.array().items(Joi.object({
    day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required()
  })).required(),
  faculty: Joi.array().items(Joi.string().hex().length(24)).optional(),
  thumbnail: Joi.string().uri().required(),
  maxStudents: Joi.number().min(1).default(50),
  tags: Joi.array().items(Joi.string()).optional(),
  difficulty: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').default('Beginner')
});

// Faculty validation schemas
const createFacultySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  qualification: Joi.string().required(),
  specialization: Joi.array().items(Joi.string()).min(1).required(),
  experience: Joi.number().min(0).required(),
  bio: Joi.string().max(500).optional(),
  image: Joi.string().uri().required(),
  achievements: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    description: Joi.string().optional()
  })).optional(),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
    website: Joi.string().uri().optional()
  }).optional()
});

// Blog validation schemas
const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(50).required(),
  excerpt: Joi.string().max(200).optional(),
  thumbnail: Joi.string().uri().required(),
  category: Joi.string().valid('Education', 'Exam Tips', 'Career Guidance', 'Success Stories', 'News').required(),
  tags: Joi.array().items(Joi.string()).optional(),
  seo: Joi.object({
    metaTitle: Joi.string().optional(),
    metaDescription: Joi.string().optional(),
    keywords: Joi.array().items(Joi.string()).optional()
  }).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  featured: Joi.boolean().default(false),
  readTime: Joi.number().min(1).default(5)
});

// Inquiry validation schemas
const createInquirySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  subject: Joi.string().min(3).max(100).required(),
  message: Joi.string().min(10).max(1000).required(),
  course: Joi.string().hex().length(24).optional()
});

// Validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  createCourseSchema,
  createFacultySchema,
  createBlogSchema,
  createInquirySchema,
  validate
};
