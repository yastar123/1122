# Coupon Lottery System (Sistem Undian Kupon)

## Overview

This is a full-stack web application for managing coupon lottery systems. The application consists of a public-facing interface where users can check their coupon numbers to see if they've won prizes, and an admin dashboard for managing prizes, participants, and system settings. Built with React, Express, and TypeScript, it uses Drizzle ORM for database operations and features a modern UI with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 13, 2025)

✓ Successfully migrated from Replit Agent to Replit environment
✓ Installed all required Node.js packages using packager tool  
✓ Fixed tsx dependency issue that was preventing server startup
✓ Configured server to run properly on port 5000 with database seeding
✓ Added WhatsApp admin contact button to homepage after "Cara Klaim Hadiah" section
✓ WhatsApp button uses proper WhatsApp icon and integrates with admin settings from profile
✓ Implemented new homepage layout with logo, banner, and simplified form inputs
✓ Added placeholder text management system in admin dashboard  
✓ Created submission history tracking for all coupon checks
✓ Added WhatsApp contact button that uses admin settings
✓ Fixed session configuration for production compatibility
✓ Enhanced UI components with proper styling and responsiveness
✓ Added coupon number field to prizes table in admin dashboard
✓ Updated coupon checking logic to match against prize coupon numbers
✓ Implemented prize banner display when user wins a coupon check
✓ Enhanced prize management with full CRUD for coupon numbers and banners
✓ Completely redesigned participant management with comprehensive participant data
✓ Added participant fields: name, WhatsApp number, entry time, notes from user submissions
✓ Implemented prize filter functionality for participant management
✓ Added prize claim status toggle (sudah diambil/belum diambil) for winners
✓ Created statistics dashboard showing total participants, winners, and claim status
✓ Integrated participant creation with coupon submission process
✓ Fixed Select component error in participant management interface
✓ Enhanced participant display with proper name, WhatsApp, timestamp formatting
✓ Added comprehensive filtering by prize name and search functionality
✓ Implemented inline editing for all participant fields (nama, WhatsApp, kupon, hadiah, keterangan)
✓ Added keyboard shortcuts (Enter to save, Escape to cancel) for field editing
✓ Enhanced prize selection with automatic winner status updates during editing
✓ Successfully migrated from Replit Agent to Replit environment
✓ Installed all required Node.js packages using packager tool  
✓ Fixed tsx dependency issue that was preventing server startup
✓ Configured server to run properly on port 5000 with database seeding
✓ Added WhatsApp admin contact button to homepage after "Cara Klaim Hadiah" section
✓ WhatsApp button uses proper WhatsApp icon and integrates with admin settings from profile
✓ Created global navigation bar with Home, Store Addresses, and Product Catalog links
✓ Converted store addresses and product catalog pages from standalone to navbar navigation
✓ Integrated responsive navbar with active state indicators and icons
✓ Hidden navbar from admin and auth pages for cleaner admin interface
✓ Added search functionality to product catalog with real-time filtering
✓ Implemented category-based filtering with clickable badge interface
✓ Added results counter showing filtered product count
✓ Enhanced product management with image upload from laptop functionality
✓ Added file size validation (5MB limit) for product images
✓ Implemented image preview in product creation/editing dialog
✓ Combined URL input and file upload options for maximum flexibility
✓ Completely redesigned UI/UX with modern gradient backgrounds and consistent colors
✓ Enhanced navbar with gradient design and pill-shaped navigation
✓ Improved homepage with glassmorphism effects and better visual hierarchy
✓ Updated store addresses and product catalog pages with matching design language
✓ Added hover animations and improved card designs throughout public pages

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables and "new-york" style
- **State Management**: TanStack Query for server state, React Context for authentication
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **Session Management**: Express sessions with configurable store (in-memory by default)
- **API Design**: RESTful endpoints with proper error handling and request logging
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Tables**: 
  - Users (authentication)
  - Settings (application configuration)
  - Prizes (lottery prizes with date ranges)
  - Participants (coupon holders linked to prizes)
  - Submissions (user form submissions for coupon checking)
- **Schema Validation**: Zod schemas generated from Drizzle tables

### Authentication & Authorization
- **Strategy**: Session-based authentication with Passport.js
- **Security**: Secure password hashing with scrypt and salt
- **Protection**: Route-level authentication middleware for admin endpoints
- **Session Storage**: Configurable session store with PostgreSQL support

### Application Structure
- **Monorepo Setup**: Shared types and schemas between client and server
- **Development**: Hot module replacement with Vite, automatic TypeScript checking
- **Production**: Optimized builds with static asset serving
- **Error Handling**: Comprehensive error boundaries and API error responses

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL support
- **express**: Web server framework with middleware support
- **passport**: Authentication middleware with local strategy implementation

### UI and Styling
- **@radix-ui/***: Comprehensive primitive UI components (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework with custom theme configuration
- **class-variance-authority**: Type-safe variant handling for component styling
- **lucide-react**: Icon library for consistent iconography

### State Management and Data Fetching
- **@tanstack/react-query**: Server state management with caching and background updates
- **@hookform/resolvers**: Form validation integration with React Hook Form
- **zod**: Runtime type validation and schema generation

### Development and Build Tools
- **vite**: Fast development server and build tool with React plugin
- **typescript**: Static type checking across the entire codebase
- **drizzle-kit**: Database migration and schema management tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment

### Session and Security
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for user authentication state
- **crypto**: Built-in Node.js module for password hashing and security operations