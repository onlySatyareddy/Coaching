import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { studentAPI } from '../services/api'
import { formatPrice, formatDate } from '../utils/helpers'
import { 
  FiBookOpen, 
  FiTrendingUp, 
  FiClock, 
  FiAward, 
  FiCalendar,
  FiPlay,
  FiDownload,
  FiChevronRight,
  FiUser
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesResponse] = await Promise.all([
          studentAPI.getEnrolledCourses()
        ])
        
        setEnrolledCourses(coursesResponse.data.courses || [])
        
        // Calculate stats
        const courses = coursesResponse.data.courses || []
        setStats({
          totalCourses: courses.length,
          completedCourses: courses.filter(c => c.progress === 100).length,
          inProgressCourses: courses.filter(c => c.progress > 0 && c.progress < 100).length,
          totalHours: courses.reduce((acc, course) => acc + (course.duration || 0), 0)
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    return 'bg-yellow-500'
  }

  const getStatusText = (progress) => {
    if (progress === 100) return 'Completed'
    if (progress > 0) return 'In Progress'
    return 'Not Started'
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
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-gray-600">
            Track your learning progress and manage your courses
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <FiBookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalCourses}</span>
            </div>
            <h3 className="text-gray-600">Total Courses</h3>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.completedCourses}</span>
            </div>
            <h3 className="text-gray-600">Completed</h3>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <FiClock className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</span>
            </div>
            <h3 className="text-gray-600">In Progress</h3>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <FiAward className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalHours}h</span>
            </div>
            <h3 className="text-gray-600">Learning Hours</h3>
          </div>
        </motion.div>

        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link
              to="/courses"
              className="btn-primary flex items-center space-x-2"
            >
              <FiBookOpen />
              <span>Browse More Courses</span>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses enrolled yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Link to="/courses" className="btn-primary">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiBookOpen className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <FiClock />
                              <span>{course.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FiCalendar />
                              <span>Enrolled: {formatDate(course.enrolledAt)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 lg:items-end lg:space-y-2 lg:space-x-4 lg:flex-row">
                      <div className="text-center lg:text-right">
                        <div className="text-sm text-gray-600 mb-1">Progress</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {getStatusText(course.progress)}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="btn-primary flex items-center space-x-1 px-4 py-2">
                          <FiPlay />
                          <span>Continue</span>
                        </button>
                        <button className="btn-outline flex items-center space-x-1 px-4 py-2">
                          <FiDownload />
                          <span>Materials</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link to="/courses" className="card p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiBookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Courses</h3>
                <p className="text-sm text-gray-600">Discover new courses</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>

          <Link to="/profile" className="card p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>

          <Link to="/certificates" className="card p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiAward className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Certificates</h3>
                <p className="text-sm text-gray-600">View your achievements</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default StudentDashboard
