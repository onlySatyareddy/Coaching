import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiBookOpen, FiUsers, FiTarget, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import { publicAPI } from '../services/api'
import toast from 'react-hot-toast'

const About = () => {
  const [stats, setStats] = useState([
    { label: 'Years of Excellence', value: '10+', icon: <FiAward /> },
    { label: 'Students Taught', value: '5000+', icon: <FiUsers /> },
    { label: 'Success Rate', value: '95%', icon: <FiTrendingUp /> },
    { label: 'Courses Offered', value: '25+', icon: <FiBookOpen /> },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicAPI.getStats()
        const apiStats = response.data.stats || {}
        
        // Update stats with real data where available
        setStats([
          { label: 'Years of Excellence', value: '10+', icon: <FiAward /> },
          { label: 'Students Taught', value: apiStats.students ? `${apiStats.students}+` : '5000+', icon: <FiUsers /> },
          { label: 'Success Rate', value: '95%', icon: <FiTrendingUp /> },
          { label: 'Courses Offered', value: apiStats.courses ? `${apiStats.courses}+` : '25+', icon: <FiBookOpen /> },
        ])
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Keep default stats if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from teaching methods to student support.',
      icon: <FiAward />
    },
    {
      title: 'Integrity',
      description: 'We maintain the highest standards of integrity in all our interactions and operations.',
      icon: <FiCheckCircle />
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate our teaching methods to provide the best learning experience.',
      icon: <FiTrendingUp />
    },
    {
      title: 'Student Focus',
      description: 'Our students\' success is our primary focus and we go above and beyond to support them.',
      icon: <FiTarget />
    },
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-500/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-4">
              About <span className="gradient-text">CODEX Center</span>
            </h1>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
              Empowering students with quality education and expert guidance since 2014
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white text-2xl">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To provide exceptional coaching and guidance to students, helping them achieve their academic goals and realize their full potential. We are committed to creating a learning environment that fosters excellence, innovation, and personal growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our <span className="gradient-text">Vision</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and respected coaching center in the country, known for our commitment to student success, innovative teaching methods, and comprehensive educational solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white text-2xl">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
