# Industrial Analytics Platform

## Overview

Industrial Analytics is a comprehensive web-based mechanical engineering calculation platform designed for students, faculty, and professionals. The application provides sophisticated calculation tools for stress analysis, beam deflection, strain calculations, and material property analysis with step-by-step solutions and safety factor assessments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React** and **TypeScript**, utilizing a modern component-based architecture. The UI framework is **shadcn/ui** with **Tailwind CSS** for styling, providing a professional and responsive design system. The application uses **Wouter** for lightweight client-side routing and **TanStack React Query** for efficient data fetching and state management.

**Key Frontend Design Decisions:**
- **Component Organization**: Modular component structure with separate UI components library for reusability
- **Form Management**: React Hook Form with Zod validation for type-safe form handling
- **State Management**: React Query for server state, local React state for UI interactions
- **Styling Approach**: Utility-first CSS with Tailwind, custom CSS variables for theming

### Backend Architecture
The server is built with **Express.js** and **TypeScript**, following a RESTful API design pattern. The application implements a layered architecture with clear separation between routes, business logic, and data access.

**Core Backend Components:**
- **Route Layer**: Express routes handling HTTP requests and responses
- **Storage Interface**: Abstract storage interface allowing for different implementations (memory-based for development, database for production)
- **Authentication**: Session-based authentication with bcrypt password hashing
- **Calculation Engine**: Mathematical computation modules for engineering calculations

### Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** as the primary database solution. The schema is designed to support user management, calculation storage, project organization, and session management.

**Database Schema Design:**
- **Users Table**: Stores user credentials, profile information, and role-based access
- **Calculations Table**: Stores calculation inputs, results, and metadata with JSON fields for flexibility
- **Projects Table**: Organizes calculations into user-defined projects
- **Sessions Table**: Manages user authentication sessions

**Storage Pattern**: The application implements a storage interface pattern allowing for multiple storage backends (currently includes in-memory storage for development and database storage for production).

### Authentication and Authorization
The system implements **session-based authentication** with the following security measures:

- **Password Security**: bcrypt hashing with salt rounds for password storage
- **Session Management**: Server-side session storage with secure HTTP-only cookies
- **Role-Based Access**: User roles (student, faculty, admin) for potential future authorization features
- **CSRF Protection**: Secure cookie configuration with appropriate flags for production

### Calculation Engine
The application features a sophisticated calculation engine supporting multiple engineering analysis types:

**Supported Calculations:**
- **Stress Analysis**: Force-based stress calculations with safety factor assessment
- **Beam Deflection**: Structural analysis for various support conditions
- **Strain Calculations**: Material deformation analysis
- **Material Properties**: Database of engineering material characteristics

**Calculation Features:**
- Step-by-step solution breakdowns
- Safety factor calculations
- Material property integration
- Result validation and status assessment (safe/warning/danger)

### Build and Development Architecture
The application uses **Vite** for fast development and optimized production builds, with **esbuild** for server-side bundling. The development environment includes hot module replacement and error overlay for efficient debugging.

**Build Configuration:**
- **Frontend**: Vite with React plugin for fast development and optimized production builds
- **Backend**: esbuild for server bundling with external package handling
- **TypeScript**: Strict type checking across the entire application
- **Path Aliases**: Configured for clean import statements and better code organization

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL support
- **bcrypt**: Cryptographic library for secure password hashing
- **express**: Web application framework for Node.js
- **cookie-parser**: Express middleware for cookie handling

### Frontend UI Framework
- **@radix-ui/\***: Comprehensive collection of accessible, unstyled UI primitives
- **@tanstack/react-query**: Data fetching and state management library
- **wouter**: Lightweight client-side routing
- **react-hook-form**: Performant forms library with minimal re-renders
- **zod**: TypeScript-first schema validation

### Development and Build Tools
- **vite**: Fast build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Static type checking
- **tsx**: TypeScript execution environment for development
- **drizzle-kit**: Database migration and schema management tools

### Authentication and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **@hookform/resolvers**: Validation resolvers for React Hook Form integration

The application is designed to be scalable and maintainable, with clear separation of concerns and modern development practices throughout the stack.