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

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build for production
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🌐 Deployment

This project is configured for easy deployment to Netlify. The `netlify.toml` file contains the necessary configuration.

### Deploying to Netlify
1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Netlify will automatically deploy the site

## 📁 Project Structure

```
/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CyberpunkInterface.jsx
│   │   ├── GlowEffect.jsx
│   │   ├── HolographicBackground.jsx
│   │   ├── NavBar.jsx
│   │   └── ...
│   ├── sections/            # Main page sections
│   │   ├── About.jsx        # About section
│   │   ├── Challenge.jsx    # Challenge tracking section
│   │   ├── Contact.jsx      # Contact section
│   │   ├── Hero.jsx         # Hero/intro section
│   │   ├── Projects.jsx     # Projects showcase section
│   │   ├── Skills.jsx       # Skills showcase section
│   │   └── Stats.jsx        # Statistics section
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
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

---

Created with ❤️ by [Your Name]

---
