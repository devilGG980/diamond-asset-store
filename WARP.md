# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Video Forge is a React-based web application for managing video editing assets with a diamond currency system. The application uses Firebase for authentication and data storage, with a modern black/white themed UI built using Tailwind CSS and Framer Motion for animations.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern="ComponentName"

# Lint and format (uses ESLint from react-scripts)
npm run build  # This also runs linting checks
```

### Firebase Setup Required
Before development, you must configure Firebase credentials in `src/config/firebase.ts`. Replace the placeholder values with your actual Firebase project configuration:
- `apiKey`
- `authDomain` 
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

## Architecture Overview

### Tech Stack
- **Frontend Framework**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS 4.1.13 with custom design system
- **Authentication & Database**: Firebase (Auth, Firestore, Storage)
- **Animations**: Framer Motion 12.23.19
- **Routing**: React Router Dom 7.9.1
- **UI Components**: Heroicons React
- **Notifications**: React Hot Toast
- **Testing**: Jest + React Testing Library

### Project Structure
```
src/
├── components/
│   └── auth/          # Authentication components
├── config/
│   └── firebase.ts    # Firebase configuration and exports
├── contexts/
│   └── AuthContext.tsx # Authentication state management
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles and Tailwind setup
```

### State Management
The application uses React Context for state management:
- **AuthContext**: Manages user authentication state, user profiles, and diamond balance
- **User Profile System**: Tracks diamonds (virtual currency), purchased assets, and user metadata

### Key Features
- **Authentication**: Email/password and Google OAuth via Firebase Auth
- **User Profiles**: Firestore-based user data with diamond currency system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Black/white theme with glass effects and smooth animations
- **Asset Management**: Track purchased digital assets

## Development Guidelines

### Component Development
- Use TypeScript for all new components
- Follow the established naming convention: PascalCase for components
- Implement proper error boundaries for Firebase operations
- Use the existing design system classes from `index.css`

### Styling Conventions
The project uses a custom design system built on Tailwind:
- **Primary Colors**: Black (#111111) and White (#ffffff)
- **Custom Components**: `.btn-primary`, `.btn-secondary`, `.card`, `.glass-effect`
- **Typography**: Inter font family with gradient text effects
- **Animations**: Custom keyframes for floating, sliding, and fading effects

### Firebase Integration Patterns
- Use the centralized Firebase exports from `src/config/firebase.ts`
- Authentication state is managed through AuthContext
- Always wrap Firebase operations in try-catch blocks with toast notifications
- User profiles are automatically created/updated on authentication

### Testing
- Tests use Jest and React Testing Library
- Test files follow the `.test.tsx` naming convention  
- Setup includes `@testing-library/jest-dom` for enhanced DOM matchers
- Run tests during development with `npm test` for watch mode

### Environment Setup
- Development server runs on port 3000 by default
- The app uses Create React App's built-in development server with hot reloading
- Production builds are optimized and include source maps

### Common Development Patterns
- Use `useState` and `useEffect` for component-level state
- Leverage the `useAuth` hook for accessing authentication state
- Implement loading states for async operations
- Use toast notifications for user feedback via react-hot-toast
- Apply framer-motion for smooth page transitions and animations

### Build Configuration
- TypeScript configuration targets ES5 with strict mode enabled
- Tailwind CSS processes all files in `src/**/*.{js,jsx,ts,tsx}`
- PostCSS configuration supports Tailwind CSS processing
- Create React App handles webpack configuration (not ejected)