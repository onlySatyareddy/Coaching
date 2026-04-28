import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiAward, FiBookOpen, FiStar, FiMail, FiPhone, FiCalendar } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { facultyAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const Faculty = () => {
  const [facultyMembers, setFacultyMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        console.log('Fetching faculty data...');
        const response = await facultyAPI.getFaculty()
        console.log('Faculty API response:', response);
        console.log('Faculty data:', response.data);
        console.log('Faculty members:', response.data?.faculty);
        
        const facultyData = response.data?.faculty || [];
        console.log('Setting faculty members:', facultyData);
        console.log('Faculty count:', facultyData.length);
        
        setFacultyMembers(facultyData);
      } catch (error) {
        console.error('Failed to fetch faculty:', error)
        toast.error('Failed to load faculty data')
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

  useEffect(() => {
    if (!loading && facultyMembers.length > 0) {
      // GSAP ScrollTrigger animations
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

      // Animate cards with stagger
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardRefs.current[0],
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [loading, facultyMembers])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-responsive-4xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Expert Faculty</span>
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
            Learn from the best minds in education with years of experience
          </p>
        </motion.div>

        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {console.log('Rendering faculty cards, count:', facultyMembers.length) || 
           (facultyMembers.length > 0 ? (
            facultyMembers.map((faculty, index) => (
            <motion.div
              key={faculty._id}
              ref={(el) => (cardRefs.current[index] = el)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="faculty-card group relative"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="card p-6 text-center h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotateY-3 hover:rotateX-3">
                {/* 3D Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Faculty Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto relative group-hover:scale-110 transition-transform duration-300">
                    {faculty.image ? (
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                        <FiUsers className="w-16 h-16 text-primary-600" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-primary-600">
                        {faculty.rating || '5.0'} ⭐
                      </span>
                    </div>
                  </div>
                </div>

                {/* Faculty Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {faculty.name}
                  </h3>
                  <p className="text-gray-600 font-medium">{faculty.qualification}</p>
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {faculty.experience} years experience
                  </p>
                  
                  {/* Specialization Tags */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {faculty.specialization?.map((spec) => (
                      <span 
                        key={spec} 
                        className="px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full hover:bg-primary-200 transition-colors duration-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {faculty.email && (
                      <div className="flex items-center justify-center gap-2">
                        <FiMail className="w-4 h-4" />
                        <span className="truncate">{faculty.email}</span>
                      </div>
                    )}
                    {faculty.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        <span>{faculty.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link 
                    to={`/faculty/${faculty._id}`}
                    className="inline-flex items-center justify-center w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:translate-y-1"
                  >
                    View Profile
                    <FiAward className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <FiUsers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No faculty members available at the moment.</p>
                <p className="text-sm mt-2">Please check back later or contact admin.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faculty
