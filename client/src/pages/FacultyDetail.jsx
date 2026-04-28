import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { FiUsers, FiAward, FiMail, FiPhone, FiCalendar, FiBookOpen, FiStar, FiChevronLeft } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { facultyAPI } from '../services/api'
import toast from 'react-hot-toast'

gsap.registerPlugin(ScrollTrigger)

const FacultyDetail = () => {
  const { id } = useParams()
  const [faculty, setFaculty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [facultyCourses, setFacultyCourses] = useState([])
  const sectionRef = useRef(null)

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        setLoading(true)
        const response = await facultyAPI.getFacultyMember(id)
        setFaculty(response.data.faculty)
        
        // Fetch courses taught by this faculty
        if (response.data.faculty?.courses?.length > 0) {
          // You might need to create this API endpoint
          // const coursesResponse = await facultyAPI.getFacultyCourses(id)
          // setFacultyCourses(coursesResponse.data.courses || [])
        }
      } catch (error) {
        console.error('Failed to fetch faculty details:', error)
        toast.error('Failed to load faculty details')
      } finally {
        setLoading(false)
      }
    }

    fetchFacultyDetails()
  }, [id])

  useEffect(() => {
    if (!loading && faculty) {
      // GSAP animations for faculty detail page
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [loading, faculty])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Faculty Not Found</h2>
          <Link to="/faculty" className="btn-primary">
            Back to Faculty
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/faculty" 
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-300"
          >
            <FiChevronLeft className="w-5 h-5 mr-2" />
            Back to Faculty
          </Link>
        </motion.div>

        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Faculty Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
              {/* Profile Image */}
              <div className="text-center mb-6">
                {faculty.image ? (
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-primary-100 shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                    <FiUsers className="w-20 h-20 text-primary-600" />
                  </div>
                )}
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-gray-900">{faculty.name}</h1>
                  <p className="text-gray-600">{faculty.qualification}</p>
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`w-4 h-4 ${i < (faculty.rating || 5) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({faculty.rating || '5.0'})</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiMail className="w-5 h-5 mr-3 text-primary-600" />
                  <span>{faculty.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiPhone className="w-5 h-5 mr-3 text-primary-600" />
                  <span>{faculty.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-5 h-5 mr-3 text-primary-600" />
                  <span>{faculty.experience} years experience</span>
                </div>
              </div>

              {/* Specialization */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Specialization</h3>
                <div className="flex flex-wrap gap-2">
                  {faculty.specialization?.map((spec) => (
                    <span 
                      key={spec} 
                      className="px-3 py-1 bg-primary-100 text-primary-600 text-sm rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button className="w-full btn-primary">
                  Contact Faculty
                </button>
                <button className="w-full btn-outline">
                  View Courses
                </button>
              </div>
            </div>
          </motion.div>

          {/* Faculty Details Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {faculty.bio || 'Passionate educator with extensive experience in teaching and mentoring students. Committed to providing quality education and helping students achieve their academic goals.'}
              </p>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievements</h2>
              {faculty.achievements?.length > 0 ? (
                <ul className="space-y-3">
                  {faculty.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <FiAward className="w-5 h-5 mr-3 text-primary-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{achievement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Achievements will be updated soon.</p>
              )}
            </div>

            {/* Courses Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Courses Taught</h2>
              {facultyCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facultyCourses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.category}</p>
                      <p className="text-primary-600 font-semibold mt-2">₹{course.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No courses assigned yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FacultyDetail
