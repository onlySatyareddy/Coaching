import React from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { FiBookOpen, FiClock, FiUsers, FiStar, FiPlay } from 'react-icons/fi'

const CourseDetail = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course Details - {id}
          </h1>
          <p className="text-gray-600">
            Course detail page will be implemented with full course information, curriculum, and enrollment options.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default CourseDetail
