import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { coursesAPI } from '../services/api'
import { formatPrice, truncateText, debounce } from '../utils/helpers'
import { 
  FiBookOpen, 
  FiStar, 
  FiClock, 
  FiUsers, 
  FiFilter,
  FiSearch,
  FiGrid,
  FiList,
  FiChevronDown,
  FiX
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 })
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    difficulty: searchParams.get('difficulty') || '',
    search: searchParams.get('search') || ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['JEE', 'NEET', 'SSC', 'Foundation', 'Board Exams']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
    }, 500),
    []
  )

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const params = {
          page: pagination?.page || 1,
          limit: pagination?.limit || 12,
          ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
        }
        
        const response = await coursesAPI.getCourses(params)
        setCourses(response.data.courses)
        setPagination(response.data.pagination)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        toast.error('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [pagination?.page || 1, filters])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      difficulty: '',
      search: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const CourseCard = ({ course, isListView = false }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      whileHover={{ y: -5 }}
      className={`card ${isListView ? 'flex' : ''} overflow-hidden`}
    >
      <div className={`${isListView ? 'w-48' : 'h-48'} relative bg-gradient-to-br from-primary-100 to-accent-100`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiBookOpen className="w-16 h-16 text-primary-600" />
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-primary-600">
            {course.category}
          </span>
        </div>
        {course.featured && (
          <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>
      
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {truncateText(course.description, 120)}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className={`flex items-center justify-between mb-4 ${isListView ? 'flex-wrap' : ''}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(course.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({course.reviews?.length || 0})
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="w-4 h-4 mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiUsers className="w-4 h-4 mr-1" />
              {course.enrolledStudents}/{course.maxStudents}
            </div>
          </div>
        </div>
        
        <div className={`flex items-center justify-between ${isListView ? 'flex-wrap' : ''}`}>
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(course.price)}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(course.originalPrice)}
              </span>
            )}
          </div>
          <Link
            to={`/courses/${course._id}`}
            className="btn-primary text-sm px-4 py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-responsive-4xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive range of courses designed to help you achieve your academic goals
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="input-field pl-10"
                defaultValue={filters.search}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FiFilter />
              <span>Filters</span>
              <FiChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
              >
                <FiList />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-6 bg-white rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Levels</option>
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <FiX />
                  <span>Clear Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {courses?.length || 0} of {pagination?.total || 0} courses
          </p>
        </div>

        {/* Courses Grid/List */}
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-4'
          }
        >
          {(courses || []).map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isListView={viewMode === 'list'}
            />
          ))}
        </motion.div>

        {/* No Results */}
        {(courses || []).length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {(pagination?.pages || 0) > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center space-x-2 mt-12"
          >
            <button
              onClick={() => handlePageChange((pagination?.page || 1) - 1)}
              disabled={(pagination?.page || 1) === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Previous
            </button>

            {[...Array(Math.min(5, pagination?.pages || 0))].map((_, index) => {
              const page = index + 1
              const isActive = page === (pagination?.page || 1)
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => handlePageChange((pagination?.page || 1) + 1)}
              disabled={(pagination?.page || 1) === (pagination?.pages || 1)}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Courses
