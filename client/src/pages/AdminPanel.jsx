import React, { useState, useEffect } from 'react'
import { uploadImage } from '../services/cloudinary'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { adminAPI, testimonialsAPI, resultsAPI, ordersAPI, batchesAPI } from '../services/api'
import { 
  FiUsers, 
  FiBookOpen, 
  FiBarChart, 
  FiSettings, 
  FiTrendingUp,
  FiDollarSign,
  FiMessageSquare,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiSearch,
  FiUser,
  FiX,
  FiSave,
  FiUpload,
  FiAward
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalFaculty: 0,
    totalInquiries: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // Additional state for different modules
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [blogs, setBlogs] = useState([])
  const [results, setResults] = useState([])
  const [payments, setPayments] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [orders, setOrders] = useState([])
  const [batches, setBatches] = useState([])
  
  // Form states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const statsResponse = await adminAPI.getDashboardStats();
        
        console.log('Dashboard response:', statsResponse);
        console.log('Response data:', statsResponse.data);
        
        // Extract stats from response with multiple fallbacks
        const statsData = statsResponse?.data?.stats || 
                          statsResponse?.data || 
                          statsResponse?.data?.data || {
          totalStudents: 0,
          totalCourses: 0,
          totalFaculty: 0,
          totalInquiries: 0,
          totalRevenue: 0
        };
        
        console.log('Extracted stats:', statsData);
        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
        setLoading(false);
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'inquiries') {
      fetchInquiries()
    } else if (activeTab === 'courses') {
      fetchCourses()
    } else if (activeTab === 'faculty') {
      fetchFaculty()
    } else if (activeTab === 'blogs') {
      fetchBlogs()
    } else if (activeTab === 'results') {
      fetchResults()
    } else if (activeTab === 'payments') {
      fetchPayments()
    } else if (activeTab === 'testimonials') {
      fetchTestimonials()
    } else if (activeTab === 'orders') {
      fetchOrders()
    } else if (activeTab === 'batches') {
      fetchBatches()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers()
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    }
  }

  const fetchInquiries = async () => {
    try {
      const response = await adminAPI.getAllInquiries()
      setInquiries(response.data.inquiries || [])
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
      toast.error('Failed to load inquiries')
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await adminAPI.getCourses()
      setCourses(response.data.courses || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      toast.error('Failed to load courses')
    }
  }

  const fetchFaculty = async () => {
    try {
      console.log('Fetching faculty data...');
      const response = await adminAPI.getFaculty()
      console.log('Faculty response:', response);
      console.log('Response data:', response.data);
      
      const facultyData = response.data?.faculty || response.data?.faculty || [];
      console.log('Faculty data:', facultyData);
      console.log('Faculty count:', facultyData.length);
      
      setFaculty(facultyData);
    } catch (error) {
      console.error('Failed to fetch faculty:', error)
      toast.error('Failed to load faculty')
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await adminAPI.getBlogs()
      setBlogs(response.data.blogs || [])
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
      toast.error('Failed to load blogs')
    }
  }

  const fetchResults = async () => {
    try {
      const response = await adminAPI.getResults()
      setResults(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch results:', error)
      toast.error('Failed to load results')
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await ordersAPI.getAll()
      setPayments(response.data.orders || [])
    } catch (error) {
      console.error('Failed to fetch payments:', error)
      toast.error('Failed to load payments')
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll()
      setTestimonials(response.data.testimonials || [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      toast.error('Failed to load testimonials')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    }
  }

  const fetchBatches = async () => {
    try {
      const response = await batchesAPI.getAll()
      setBatches(response.data.batches || [])
    } catch (error) {
      console.error('Failed to fetch batches:', error)
      toast.error('Failed to load batches')
    }
  }

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, !currentStatus)
      fetchUsers()
      toast.success('User status updated successfully')
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleInquiryStatusUpdate = async (inquiryId, status) => {
    try {
      await adminAPI.updateInquiryStatus(inquiryId, status)
      fetchInquiries()
      toast.success('Inquiry status updated successfully')
    } catch (error) {
      console.error('Failed to update inquiry status:', error)
      toast.error('Failed to update inquiry status')
    }
  }

  // CRUD handlers
  const handleAdd = (type) => {
    setModalType(type)
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (item, type) => {
    setModalType(type)
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      switch (type) {
        case 'course':
          await adminAPI.deleteCourse(id)
          fetchCourses()
          toast.success('Course deleted successfully')
          break
        case 'faculty':
          await adminAPI.deleteFaculty(id)
          fetchFaculty()
          toast.success('Faculty deleted successfully')
          break
        case 'blog':
          await adminAPI.deleteBlog(id)
          fetchBlogs()
          toast.success('Blog deleted successfully')
          break
        default:
          break
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      switch (modalType) {
        case 'course':
          if (editingItem) {
            await adminAPI.updateCourse(editingItem._id, formData)
            toast.success('Course updated successfully')
          } else {
            await adminAPI.createCourse(formData)
            toast.success('Course created successfully')
          }
          fetchCourses()
          break
        case 'faculty':
          if (editingItem) {
            await adminAPI.updateFaculty(editingItem._id, formData)
            toast.success('Faculty updated successfully')
          } else {
            await adminAPI.createFaculty(formData)
            toast.success('Faculty created successfully')
          }
          fetchFaculty()
          break
        case 'blog':
          if (editingItem) {
            await adminAPI.updateBlog(editingItem._id, formData)
            toast.success('Blog updated successfully')
          } else {
            await adminAPI.createBlog(formData)
            toast.success('Blog created successfully')
          }
          fetchBlogs()
          break
        case 'result':
          await adminAPI.addResult(formData)
          fetchResults()
          toast.success('Result added successfully')
          break
        default:
          break
      }
      
      setShowModal(false)
      setFormData({})
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to save item:', error)
      toast.error('Failed to save item')
    }
  }

  const handlePaymentStatusUpdate = async (paymentId, status) => {
    try {
      await adminAPI.updatePaymentStatus(paymentId, status)
      fetchPayments()
      toast.success('Payment status updated successfully')
    } catch (error) {
      console.error('Failed to update payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true)
      const result = await uploadImage(file)
      setFormData({ ...formData, image: result.secure_url })
      setImagePreview(result.secure_url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      handleImageUpload(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-600">
            Manage your coaching center with comprehensive tools
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <FiBarChart /> },
                { id: 'users', label: 'Users', icon: <FiUsers /> },
                { id: 'courses', label: 'Courses', icon: <FiBookOpen /> },
                { id: 'faculty', label: 'Faculty', icon: <FiUsers /> },
                { id: 'blogs', label: 'Blogs', icon: <FiEdit /> },
                { id: 'results', label: 'Results', icon: <FiAward /> },
                { id: 'payments', label: 'Payments', icon: <FiDollarSign /> },
                { id: 'inquiries', label: 'Inquiries', icon: <FiMessageSquare /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiUsers className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalStudents}</span>
                </div>
                <h3 className="text-gray-600">Total Students</h3>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiBookOpen className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalCourses}</span>
                </div>
                <h3 className="text-gray-600">Total Courses</h3>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiUsers className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</span>
                </div>
                <h3 className="text-gray-600">Total Faculty</h3>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiMessageSquare className="w-8 h-8 text-yellow-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</span>
                </div>
                <h3 className="text-gray-600">Total Inquiries</h3>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiDollarSign className="w-8 h-8 text-red-600" />
                  <span className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</span>
                </div>
                <h3 className="text-gray-600">Total Revenue</h3>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn-primary flex items-center justify-center space-x-2">
                  <FiPlus />
                  <span>Add New Course</span>
                </button>
                <button className="btn-outline flex items-center justify-center space-x-2">
                  <FiUsers />
                  <span>Manage Faculty</span>
                </button>
                <button className="btn-outline flex items-center justify-center space-x-2">
                  <FiBarChart />
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users
                    .filter(user => 
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FiEye />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                            className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {user.isActive ? <FiTrash2 /> : <FiTrendingUp />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Courses</h2>
              <button
                onClick={() => handleAdd('course')}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus />
                <span>Add Course</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${course.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FiEye />
                          </button>
                          <button 
                            onClick={() => handleEdit(course, 'course')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <FiEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(course._id, 'course')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Faculty Tab */}
        {activeTab === 'faculty' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Faculty</h2>
              <button
                onClick={() => handleAdd('faculty')}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus />
                <span>Add Faculty</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map((member) => (
                <div key={member._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={member.image || '/default-avatar.png'}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.specialization}</p>
                      <p className="text-sm text-gray-500 mt-1">{member.experience} experience</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <button 
                      onClick={() => handleEdit(member, 'faculty')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(member._id, 'faculty')}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Blogs</h2>
              <button
                onClick={() => handleAdd('blog')}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus />
                <span>Add Blog</span>
              </button>
            </div>

            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span>By {blog.author?.name}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(blog, 'blog')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id, 'blog')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Results</h2>
              <button
                onClick={() => handleAdd('result')}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus />
                <span>Add Result</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.student?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.course?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.exam}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.rank}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.student?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.course?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.course?.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={payment.paymentStatus || 'pending'}
                          onChange={(e) => handlePaymentStatusUpdate(payment._id, e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Inquiries</h2>
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-400" />
                <select className="input-field">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                        <span className="text-sm text-gray-500">• {inquiry.email}</span>
                        <span className="text-sm text-gray-500">• {inquiry.phone}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{inquiry.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Course: {inquiry.course || 'General'}</span>
                        <span>Date: {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleInquiryStatusUpdate(inquiry._id, e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modal */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItem ? `Edit ${modalType}` : `Add ${modalType}`}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === 'course' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input-field"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={formData.duration || ''}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="JEE">JEE</option>
                        <option value="NEET">NEET</option>
                        <option value="SSC">SSC</option>
                        <option value="Foundation">Foundation</option>
                        <option value="Board Exams">Board Exams</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                      <input
                        type="url"
                        value={formData.thumbnail || ''}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="input-field"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                  </>
                )}

                {modalType === 'faculty' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          {imagePreview || formData.image ? (
                            <img
                              src={imagePreview || formData.image}
                              alt="Preview"
                              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                              <FiUsers className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <input
                              type="file"
                              onChange={handleImageChange}
                              accept="image/*"
                              className="hidden"
                              id="faculty-image-upload"
                            />
                            <label
                              htmlFor="faculty-image-upload"
                              className="btn-outline cursor-pointer inline-flex items-center"
                            >
                              {uploadingImage ? 'Uploading...' : 'Choose Image'}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <input
                        type="text"
                        value={formData.qualification || ''}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <input
                        type="text"
                        value={formData.specialization || ''}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="input-field"
                        placeholder="Physics, Chemistry, Mathematics"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                      <input
                        type="number"
                        value={formData.experience || ''}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="input-field"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="input-field"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={formData.image || ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                {modalType === 'blog' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setFormData({ ...formData, title, slug });
                        }}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="input-field"
                        placeholder="blog-post-slug"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                      <textarea
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="input-field"
                        rows={2}
                        placeholder="Brief description of the blog post"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="input-field"
                        rows={6}
                        placeholder="Full blog content"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                      <input
                        type="url"
                        value={formData.thumbnail || ''}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="input-field"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Education">Education</option>
                        <option value="Exam Tips">Exam Tips</option>
                        <option value="Career Guidance">Career Guidance</option>
                        <option value="Success Stories">Success Stories</option>
                        <option value="News">News</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input
                        type="text"
                        value={formData.tags?.join(', ') || ''}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                        className="input-field"
                        placeholder="education, tips, guidance"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status || 'draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="input-field"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </>
                )}

                {modalType === 'result' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <input
                        type="text"
                        value={formData.student || ''}
                        onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                      <input
                        type="text"
                        value={formData.course || ''}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                        <input
                          type="text"
                          value={formData.exam || ''}
                          onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                        <input
                          type="number"
                          value={formData.score || ''}
                          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                        <input
                          type="number"
                          value={formData.rank || ''}
                          onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                      <input
                        type="text"
                        value={formData.image || ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FiSave />
                    <span>{editingItem ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
