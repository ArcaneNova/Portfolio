# 🚀 Advanced 3D Portfolio Website

A modern, cyberpunk-themed portfolio website with interactive 3D elements, holographic backgrounds, and futuristic UI components. This portfolio showcases projects, skills, achievements, and personal journey in an engaging, visually impressive format.

![Portfolio Preview](public/portfolio-preview.jpg)

## ✨ Features

### 🌟 Visual Design
- **Holographic 3D Background**: Dynamic, interactive background with Three.js
- **Cyberpunk Interface**: Futuristic UI components with glow effects and scanner animations
- **Custom Animations**: GSAP-powered animations triggered by scroll and interaction
- **Responsive Design**: Optimized for all device sizes

### 📋 Key Sections

#### 🏠 Home/Hero
- Interactive typing effect
- Animated profile image with cyberpunk styling
- Smooth fade-in animations for a captivating entrance

#### 👤 About
- Personal biography with cyberpunk interface styling
- Interactive journey timeline with animation
- Achievements showcase with visual cards

#### 💻 Projects
- Featured projects carousel
- Category filtering (Web, ML/AI, Full Stack, API/Backend)
- Interactive 3D cards with hover effects
- Project details including:
  - Status badges (live, ongoing, completed)
  - Tech stack tags
  - Key features/highlights
  - Links to live demos and GitHub repos

#### 🛠️ Skills
- Interactive visualization of technical skills
- Categorized display (Programming Languages, Frontend, Backend, ML/AI)
- Progress indicators for skill proficiency
- Tools and technologies showcase

#### 📊 Stats
- Animated counters for statistics (lines of code, projects, contributions)
- GitHub-style contribution graph
- Coding platform statistics (GitHub, LeetCode, etc.)
- Interactive platform tabs

#### 🎯 Challenge
- Interactive challenge tracking cards
- Progress indicators for ongoing challenges
- Recent updates with dynamic content

#### 📞 Contact
- Contact form with animations
- Social media links with hover effects
- Personal information with cyberpunk styling

### 🔧 Technical Features
- **Modular Components**: Clean component architecture for maintainability
- **State Management**: Efficient React state handling
- **Performance Optimized**: Fast loading and smooth animations
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessible**: Designed with accessibility in mind

### Admin Dashboard
- **Secure Authentication**: JWT-based authentication system with protected routes
- **CRUD Operations**: Full management of projects, blogs, tasks, and more
- **Search & Filter**: Advanced search, filter, and sorting capabilities
- **Responsive Layout**: Mobile-friendly admin interface

### Backend
- **RESTful API**: Comprehensive API for all portfolio data
- **MongoDB Database**: Scalable data storage with Mongoose ODM
- **JWT Authentication**: Secure user authentication and authorization
- **File Uploads**: Image upload capability with Cloudinary integration
- **Validation**: Request validation using express-validator

## 🚀 Technologies Used

### Frontend Framework & Libraries
- **React 19**: Modern component-based architecture
- **Three.js**: 3D graphics and effects
- **GSAP**: Advanced animations and transitions
- **Framer Motion**: UI animations and gestures

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Icons**: Comprehensive icon library
- **Custom Components**: Reusable UI components like:
  - CyberpunkInterface
  - GlowEffect
  - HolographicBackground
  - TypewriterEffect

### Build Tools
- **Vite**: Fast, modern build tool
- **ESLint**: Code quality and consistency
- **Netlify**: Deployment and hosting

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or later)
- npm or yarn
- MongoDB account (for database)
- Cloudinary account (for image uploads)

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```
# Server configuration
PORT=8888
NODE_ENV=production

# Database configuration
MONGODB_URI=mongodb+srv://your_mongodb_connection_string

# JWT configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server with both frontend and backend
   ```bash
   npm run dev:full
   ```

4. For Netlify local development (with serverless functions)
   ```bash
   npm run netlify:dev
   ```

5. Build for production
   ```bash
   npm run build
   ```

## 🌐 Deployment

This project is configured for easy deployment to Netlify, with integrated backend serverless functions.

### Netlify Deployment Steps
1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Add the necessary environment variables in Netlify's dashboard
4. Deploy with the following settings:
   - Build command: `npm run netlify:build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## 📁 Project Structure

```
/
├── netlify/
│   └── functions/            # Netlify serverless functions
├── public/                   # Static assets
├── server/                   # Backend API code
│   ├── controllers/          # API controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   └── server.js             # Express server entry point
├── src/
│   ├── components/           # React components
│   │   ├── admin/            # Admin dashboard components
│   │   └── ...               # Other UI components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   │   ├── admin/            # Admin pages
│   │   └── ...               # Public pages
│   ├── sections/             # Main page sections
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── .env.local                # Environment variables
├── netlify.toml              # Netlify configuration
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 🎨 Customization

### Changing Personal Information
- Edit the text content in each section component
- Update project data in `Projects.jsx`
- Update skills data in `Skills.jsx`

### Modifying the Theme
- Edit the color schemes in `tailwind.config.js`
- Modify animations in GSAP configurations
- Update 3D elements in HolographicBackground component

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- Three.js for 3D graphics capabilities
- GSAP for smooth animations
- Tailwind CSS for styling utilities
- React ecosystem for component architecture
- MongoDB and Express for backend functionality
- Netlify for hosting and serverless capabilities

---

Created with ❤️ by [Your Name]

---
