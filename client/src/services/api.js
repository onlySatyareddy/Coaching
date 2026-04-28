import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// Retry function
const retryRequest = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status === 429)) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)))
      return retryRequest(fn, retries - 1)
    }
    throw error
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
}

// Courses API
export const coursesAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getFeaturedCourses: () => api.get('/courses/featured'),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  addReview: (id, data) => api.post(`/courses/${id}/reviews`, data),
}

// Faculty API
export const facultyAPI = {
  getFaculty: (params) => api.get('/faculty', { params }),
  getFacultyMember: (id) => api.get(`/faculty/${id}`),
  getFeaturedFaculty: () => api.get('/faculty/featured'),
  createFaculty: (data) => api.post('/faculty', data),
  updateFaculty: (id, data) => api.put(`/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/faculty/${id}`),
}

// Student API
export const studentAPI = {
  getEnrollments: () => api.get('/student/enrollments'),
  enrollInCourse: (courseId) => api.post(`/student/enroll/${courseId}`),
  updateProgress: (enrollmentId, data) => api.put(`/student/enrollments/${enrollmentId}/progress`, data),
  addNote: (enrollmentId, data) => api.post(`/student/enrollments/${enrollmentId}/notes`, data),
  getProfile: () => api.get('/student/profile'),
  getEnrolledCourses: () => api.get('/student/courses'),
  getCourseProgress: (courseId) => api.get(`/student/courses/${courseId}/progress`),
  updateCourseProgress: (courseId, progress) => api.put(`/student/courses/${courseId}/progress`, { progress }),
  getCertificates: () => api.get('/student/certificates'),
  downloadCertificate: (certificateId) => api.get(`/student/certificates/${certificateId}/download`, { responseType: 'blob' }),
  getStudyMaterials: (courseId) => api.get(`/student/courses/${courseId}/materials`),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getInquiries: (params) => api.get('/admin/inquiries', { params }),
  updateInquiry: (id, data) => api.put(`/admin/inquiries/${id}`, data),
  getBlogs: (params) => api.get('/admin/blogs', { params }),
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  updateUserStatusByAdmin: (userId, isActive) => api.put(`/admin/users/${userId}/status`, { isActive }),
  getAllInquiries: () => api.get('/admin/inquiries'),
  updateInquiryStatus: (inquiryId, status) => api.put(`/admin/inquiries/${inquiryId}/status`, { status }),
  
  // Course Management
  getCourses: (params) => api.get('/admin/courses', { params }),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  updateCourse: (courseId, courseData) => api.put(`/admin/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  
  // Faculty Management
  getFaculty: (params) => api.get('/admin/faculty', { params }),
  createFaculty: (facultyData) => api.post('/admin/faculty', facultyData),
  updateFaculty: (facultyId, facultyData) => api.put(`/admin/faculty/${facultyId}`, facultyData),
  deleteFaculty: (facultyId) => api.delete(`/admin/faculty/${facultyId}`),
  
  // Blog Management
  createBlog: (blogData) => api.post('/admin/blogs', blogData),
  updateBlog: (blogId, blogData) => api.put(`/admin/blogs/${blogId}`, blogData),
  deleteBlog: (blogId) => api.delete(`/admin/blogs/${blogId}`),
  
  // Results Management
  getResults: (params) => api.get('/admin/results', { params }),
  addResult: (resultData) => api.post('/admin/results', resultData),
  
  // Payment Management
  getPayments: (params) => api.get('/admin/payments', { params }),
  updatePaymentStatus: (paymentId, status) => api.put(`/admin/payments/${paymentId}/status`, { status }),
  
  getReports: (type, period) => api.get(`/admin/reports/${type}`, { params: { period } }),
}

// Testimonials API
export const testimonialsAPI = {
  getFeatured: () => api.get('/testimonials/featured'),
  getAll: (params) => api.get('/testimonials', { params }),
  getById: (id) => api.get(`/testimonials/${id}`),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
}

// Results API
export const resultsAPI = {
  getFeatured: (params) => api.get('/results/featured', { params }),
  getAll: (params) => api.get('/results', { params }),
  getById: (id) => api.get(`/results/${id}`),
  getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  delete: (id) => api.delete(`/results/${id}`),
}

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getByStudent: (studentId) => api.get(`/orders/student/${studentId}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updatePaymentStatus: (id, data) => api.put(`/orders/${id}/payment-status`, data),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
}

// Batches API
export const batchesAPI = {
  getAll: (params) => api.get('/batches', { params }),
  getById: (id) => api.get(`/batches/${id}`),
  getByCourse: (courseId) => api.get(`/batches/course/${courseId}`),
  getAvailable: (params) => api.get('/batches/available', { params }),
  create: (data) => api.post('/batches', data),
  update: (id, data) => api.put(`/batches/${id}`, data),
  updateStudentCount: (id, data) => api.put(`/batches/${id}/student-count`, data),
  delete: (id) => api.delete(`/batches/${id}`),
}

// Public API
export const publicAPI = {
  submitInquiry: (data) => api.post('/public/inquiry', data),
  getStats: () => api.get('/public/stats'),
  getFeaturedTestimonials: () => testimonialsAPI.getFeatured(),
  getFeaturedResults: (params) => resultsAPI.getFeatured(params),
}

export default api
