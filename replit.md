# InvasiveID Julia - Species Identification Platform

## Overview

InvasiveID Julia is a web-based species identification platform that uses AI to identify invasive plants and insects from uploaded images. The application combines a React frontend with an Express.js backend, designed to integrate with a Julia-based machine learning API for species classification. The platform focuses on conservation efforts by helping users identify invasive species across different geographic regions, with particular emphasis on Indian biodiversity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and building
- **UI System**: Shadcn/UI components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state and API caching
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **Styling**: Tailwind CSS with custom CSS variables for theming, including Indian cultural color palette (saffron, forest green, gold)
- **Component Structure**: Modern React patterns with custom hooks for business logic separation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **File Upload**: Multer middleware for handling image uploads (10MB limit, image files only)
- **API Design**: RESTful endpoints with JSON responses and comprehensive error handling
- **Development**: Hot reloading with Vite integration in development mode

### Database Schema Design
- **Users Table**: Basic authentication with username/password
- **Species Identifications**: Stores image URLs, AI predictions with confidence scores, region codes, and user associations
- **Species Reports**: Community reporting system for species sightings with location and notes
- **JSON Fields**: Predictions stored as JSON with structured data including species name, confidence, scientific name, category, impact level, and native origin

### AI Integration Architecture
- **Julia Backend**: Designed to integrate with a separate Julia-based machine learning service for species identification
- **Mock Implementation**: Currently uses simulated responses matching the expected Julia API structure
- **Regional Filtering**: Species predictions filtered by geographic region codes (BC_CA, US_NE, US_SE, IN_N, IN_S, IN_E, IN_W)
- **Species Database**: Comprehensive catalog of invasive plants and insects with scientific names and impact levels

### State Management Pattern
- **Server State**: TanStack Query handles API calls, caching, and synchronization
- **Local State**: React hooks for component-level state (file uploads, form data, UI states)
- **Error Handling**: Centralized error boundaries with toast notifications for user feedback

## External Dependencies

### Core Framework Dependencies
- **Neon Database**: PostgreSQL hosting service (@neondatabase/serverless)
- **Drizzle**: Database ORM and migration system (drizzle-orm, drizzle-kit)
- **TanStack Query**: Server state management and API layer (@tanstack/react-query)

### UI and Styling
- **Radix UI**: Primitive UI components for accessibility (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **Shadcn/UI**: Pre-built component library using class-variance-authority
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Frontend build tool with HMR and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Production bundling for backend code
- **Replit Integration**: Development environment plugins for hot reloading

### File Handling and Utilities
- **Multer**: File upload middleware with memory storage
- **Date-fns**: Date manipulation and formatting
- **Zod**: Schema validation with drizzle-zod integration
- **Wouter**: Lightweight routing library

### Planned Integrations
- **Julia ML Service**: External machine learning API for species identification
- **Image Processing**: Integration with Julia-based computer vision models
- **Geographic Services**: Region-based species filtering and mapping