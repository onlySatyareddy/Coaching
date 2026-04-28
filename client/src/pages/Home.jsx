import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Center } from '@react-three/drei'
import { coursesAPI, publicAPI, testimonialsAPI, resultsAPI } from '../services/api'
import { formatPrice, truncateText, supports3D } from '../utils/helpers'
import { 
  FiBookOpen, 
  FiUsers, 
  FiAward, 
  FiTrendingUp,
  FiPlay,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi'
import toast from 'react-hot-toast'

// 3D Particle Background Component
const ParticleBackground = () => {
  if (!supports3D()) return null

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  )
}

const Particles = () => {
  const particlesRef = useRef()
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 10
      temp.push([x, y, z])
    }
    return temp
  }, [])

  return (
    <group ref={particlesRef}>
      {(particles || []).map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? '#3B82F6' : '#F59E0B'} 
            emissive={index % 2 === 0 ? '#3B82F6' : '#F59E0B'}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Floating 3D Text Component
const Floating3DText = ({ text, position }) => {
  if (!supports3D()) return null

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Center position={position}>
        <Text
          fontSize={0.3}
          color="#3B82F6"
          anchorX="center"
          anchorY="middle"
        >
          {text}
          <meshStandardMaterial color="#3B82F6" />
        </Text>
      </Center>
    </Float>
  )
}

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [stats, setStats] = useState({ courses: 0, faculty: 0, students: 0 })
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    layoutEffect: false
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -500])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add retry logic for API calls
        const retryAPICall = async (apiCall, retries = 3, delay = 1000) => {
          try {
            return await apiCall()
          } catch (error) {
            if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status === 429)) {
              await new Promise(resolve => setTimeout(resolve, delay))
              return retryAPICall(apiCall, retries - 1, delay * 2)
            }
            throw error
          }
        }

        const [coursesResponse, statsResponse, testimonialsResponse] = await Promise.all([
          retryAPICall(() => coursesAPI.getFeaturedCourses()),
          retryAPICall(() => publicAPI.getStats()),
          retryAPICall(() => testimonialsAPI.getFeatured())
        ])
        
        setFeaturedCourses(coursesResponse.data.courses)
        setStats(statsResponse.data.stats)
        setTestimonials(testimonialsResponse.data.testimonials || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        // Don't show toast for rate limiting errors as they will be retried
        if (error.response?.status !== 429) {
          toast.error('Failed to load data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statsData = [
    { label: 'Students', value: stats?.students || 0, icon: <FiUsers />, color: 'from-blue-500 to-blue-600' },
    { label: 'Courses', value: stats?.courses || 0, icon: <FiBookOpen />, color: 'from-green-500 to-green-600' },
    { label: 'Faculty', value: stats?.faculty || 0, icon: <FiAward />, color: 'from-purple-500 to-purple-600' },
    { label: 'Success Rate', value: '98%', icon: <FiTrendingUp />, color: 'from-orange-500 to-orange-600' },
  ]

  const features = [
    {
      title: 'Expert Faculty',
      description: 'Learn from experienced educators with proven track records',
      icon: <FiAward />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Comprehensive Study Material',
      description: 'Access to high-quality study materials and resources',
      icon: <FiBookOpen />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Regular Assessments',
      description: 'Continuous evaluation to track your progress',
      icon: <FiTrendingUp />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Doubt Clearing Sessions',
      description: 'Personalized attention to clear your doubts',
      icon: <FiUsers />,
      color: 'bg-orange-100 text-orange-600'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-500/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              style={{ y: textY, opacity }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-responsive-5xl font-bold text-gray-900 mb-6"
              >
                <span className="gradient-text">Transform Your Dreams</span>
                <br />
                Into Reality
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-responsive-lg text-gray-600 mb-8 leading-relaxed"
              >
                Join CODEX Center and embark on a journey of academic excellence. 
                We provide comprehensive coaching for JEE, NEET, SSC, and more.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/courses" className="btn-primary">
                  Explore Courses
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Book Free Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Right 3D Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative h-96 lg:h-full"
            >
              {supports3D() ? (
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Floating3DText text="CODEX" position={[0, 2, 0]} />
                  <Floating3DText text="CENTER" position={[0, 0, 0]} />
                </Canvas>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                      <span className="text-white font-bold text-4xl">C</span>
                    </div>
                    <h2 className="text-2xl font-bold gradient-text">CODEX Center</h2>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 section-gradient"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {(statsData || []).map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
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
      </motion.section>

      {/* Features Section */}
      <motion.section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-responsive-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">CODEX Center</span>
            </h2>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
              We provide the best learning environment with experienced faculty and comprehensive study materials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(features || []).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card p-6 text-center"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className="text-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Courses Section */}
      <motion.section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-responsive-4xl font-bold text-gray-900 mb-4">
              Featured <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
              Explore our most popular courses designed to help you succeed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredCourses || []).slice(0, 6).map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card overflow-hidden"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-accent-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiBookOpen className="w-16 h-16 text-primary-600" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-primary-600">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {truncateText(course.description, 100)}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
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
                  </div>
                  
                  <div className="flex items-center justify-between">
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
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses" className="btn-primary">
              View All Courses
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-responsive-4xl font-bold text-gray-900 mb-4">
              Student <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our students who achieved their dreams with CODEX Center
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(testimonials || []).map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-responsive-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-responsive-lg text-white/90 mb-8">
              Join thousands of students who have achieved their dreams with CODEX Center
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-secondary">
                Get Started Now
              </Link>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Schedule a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
