import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHome, FiSearch } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full inline-flex items-center justify-center space-x-2"
          >
            <FiHome />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/courses"
            className="btn-outline w-full inline-flex items-center justify-center space-x-2"
          >
            <FiSearch />
            <span>Browse Courses</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
