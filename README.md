# 🎓 CODEX Center - Production-Ready Coaching Web Application

A comprehensive MERN stack coaching center web application with advanced animations, 3D effects, and modern UI/UX design.

## ✨ Features

### 🏗️ Core Features
- **Authentication System**: JWT-based auth with refresh tokens
- **Role-based Access**: Student & Admin roles
- **Course Management**: Browse, filter, and enroll in courses
- **Faculty Profiles**: Expert faculty information
- **Contact System**: Inquiry management with email notifications
- **Responsive Design**: Mobile-first approach

### 🎨 Advanced Features
- **3D Animations**: React Three Fiber integration
- **Smooth Scrolling**: Lenis for buttery-smooth experience
- **Page Transitions**: Framer Motion animations
- **Interactive UI**: Micro-interactions and hover effects
- **Glassmorphism**: Modern design elements
- **Performance Optimized**: Lazy loading and code splitting

### 🛠️ Tech Stack

#### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Three Fiber** for 3D graphics
- **GSAP** for advanced animations
- **Lenis** for smooth scrolling
- **Axios** for API calls
- **React Router** for navigation

#### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for validation
- **Multer** for file uploads
- **Socket.io** for real-time features

#### Database Models
- **User**: Authentication and profiles
- **Course**: Course catalog and management
- **Faculty**: Faculty information
- **Enrollment**: Student enrollments
- **Blog**: Content management
- **Inquiry**: Lead management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Coaching center"
```

2. **Install dependencies**
```bash
npm run install-deps
```

3. **Environment Setup**

#### Backend Environment
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codex-coaching
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_make_it_long_and_secure
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
NODE_ENV=development
```

#### Frontend Environment
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

4. **Start MongoDB**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (update .env with connection string)
```

5. **Run the application**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 📁 Project Structure

```
Coaching center/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   └── hooks/         # Custom hooks
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── package.json          # Root package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT-based authentication with:
- **Access Tokens**: 15-minute expiry
- **Refresh Tokens**: 7-day expiry (HTTP-only cookies)
- **Role-based Authorization**: Student & Admin access levels

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Courses
- `GET /api/courses` - Get all courses with filters
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

#### Faculty
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/featured` - Get featured faculty
- `GET /api/faculty/:id` - Get faculty details
- `POST /api/faculty` - Create faculty (Admin only)
- `PUT /api/faculty/:id` - Update faculty (Admin only)
- `DELETE /api/faculty/:id` - Delete faculty (Admin only)

#### Public
- `POST /api/public/inquiry` - Submit inquiry
- `GET /api/public/stats` - Get public statistics

## 🎨 UI Components

### Animation Libraries
- **Framer Motion**: Page transitions and micro-interactions
- **GSAP**: Advanced scroll animations
- **React Three Fiber**: 3D graphics and particles
- **Lenis**: Smooth scrolling experience

### Design System
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Glassmorphism**: Modern glass effects
- **Gradient Borders**: Dynamic border animations

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Performance Optimizations
- **Lazy Loading**: Components and images
- **Code Splitting**: Route-based splitting
- **Memoization**: React.memo, useMemo, useCallback
- **Image Optimization**: WebP format support
- **3D Fallback**: Disable on low-end devices

## 🔧 Development

### Available Scripts

#### Root Commands
```bash
npm run dev          # Start both frontend and backend
npm run server        # Start backend only
npm run client       # Start frontend only
npm run build        # Build for production
npm run install-deps # Install all dependencies
```

#### Backend (server/)
```bash
npm run dev          # Development with nodemon
npm start           # Production start
```

#### Frontend (client/)
```bash
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # ESLint check
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy `dist/` folder to Vercel/Netlify

### Backend Deployment (Render/AWS)
1. Set environment variables
2. Deploy server directory
3. Configure MongoDB Atlas

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production_secret
JWT_REFRESH_SECRET=production_refresh_secret
```

## 🧪 Testing

### API Testing
Use Postman or similar tool with the following collection:
- Import the API endpoints
- Set base URL to `http://localhost:5000`
- Test authentication flows

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Course browsing and filtering
- [ ] Faculty profiles
- [ ] Contact form submission
- [ ] Responsive design on mobile
- [ ] Animations and transitions
- [ ] 3D effects on desktop

## 🛠️ Customization

### Adding New Pages
1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Update navigation in `client/src/components/Navbar.jsx`

### Adding New API Endpoints
1. Create controller in `server/controllers/`
2. Add route in `server/routes/`
3. Update API service in `client/src/services/api.js`

### Styling Customization
- Modify `client/tailwind.config.js` for theme changes
- Update `client/src/index.css` for custom styles
- Add new components in `client/src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description

## 🎯 Future Enhancements

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Video lecture streaming
- [ ] Live classes with WebRTC
- [ ] Progress tracking dashboard
- [ ] Certificate generation
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support

---

**Built with ❤️ for educational excellence**
