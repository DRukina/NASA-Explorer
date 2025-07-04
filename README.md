# NASA Explorer

A modern, full-stack web application that showcases NASA's space data through an interactive and engaging interface. Explore the cosmos with real-time data from NASA's Open APIs, featuring astronomy pictures and near-Earth object tracking.

## Features

### Astronomy Picture of the Day (APOD)
- **Daily Space Imagery**: Browse NASA's daily astronomy pictures with stunning high-resolution viewing
- **Historical Archive**: Access pictures from any date with an intuitive date picker
- **Random Discovery**: Get random astronomy pictures for serendipitous exploration
- **Date Range Browsing**: View multiple pictures across custom date ranges
- **Detailed Metadata**: Rich descriptions, copyright information, and technical details
- **HD Downloads**: Direct access to high-definition versions when available

### Near Earth Objects (NEO) Tracker
- **Real-time Monitoring**: Track asteroids and their approach data with live updates
- **Interactive Dashboard**: Comprehensive overview with filtering and sorting capabilities
- **Data Visualizations**: Beautiful charts showing approach patterns and risk assessments
- **Current Week View**: Quick access to this week's approaching objects
- **Today's Objects**: Focused view of objects approaching today
- **Detailed Statistics**: Global NEO statistics and trends
- **Individual Object Details**: Deep dive into specific asteroid information

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth skeleton loading animations
- **Error Handling**: Comprehensive error boundaries with user-friendly messages
- **Performance Optimized**: Intelligent caching and code splitting
- **Type Safety**: Full TypeScript coverage for reliability

## Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **TanStack Query (React Query)** - Powerful data fetching and caching
- **Recharts** - Beautiful and responsive charts
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Fast, minimalist web framework
- **TypeScript** - Type-safe server development
- **Axios** - HTTP client for NASA API integration
- **Node-cache** - In-memory caching for performance
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Quick Start

### Prerequisites
- **Node.js 18+** 
- **npm** or **pnpm**
- **NASA API Key** (optional - DEMO_KEY works with limitations)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasa-explorer
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # NASA API Configuration
   NASA_API_KEY=your_nasa_api_key_here  # Get from https://api.nasa.gov
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend (from backend directory)
   npm run dev
   
   # Terminal 2 - Frontend (from frontend directory)
   npm run dev
   ```

5. **Open your browser**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001
   - **Health Check**: http://localhost:3001/health

## API Documentation

### Base URL
- **Development**: `http://localhost:3001`
- **Health Check**: `GET /health`

### APOD Endpoints

#### Get Today's Picture
```http
GET /api/apod
```

#### Get Picture for Specific Date
```http
GET /api/apod?date=YYYY-MM-DD
```

#### Get Random Pictures
```http
GET /api/apod/random?count=5
```
- `count`: Number of random pictures (1-10, default: 1)

#### Get Picture Range
```http
GET /api/apod/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
- Maximum range: 30 days

### NEO Endpoints

#### Get Current Week's Objects
```http
GET /api/neo
```

#### Get Objects for Date Range
```http
GET /api/neo/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
- Maximum range: 7 days

#### Get Today's Objects
```http
GET /api/neo/today
```

#### Get NEO Statistics
```http
GET /api/neo/stats
```

#### Get Specific Object Details
```http
GET /api/neo/:id
```

### Response Format
All endpoints return data in this format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "cached": false,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Development

### Available Scripts

#### Backend
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run lint       # Run ESLint for code quality
npm run lint:fix   # Auto-fix ESLint issues
npm run format     # Format code with Prettier
npm run format:check # Check code formatting
npm test           # Run Jest tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

#### Frontend
```bash
npm run dev        # Start Vite development server with hot reload
npm run build      # Build for production (TypeScript + Vite)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint for code quality checks
npm run lint:fix   # Auto-fix ESLint issues
npm run format     # Format code with Prettier
npm run format:check # Check if code is properly formatted
npm test           # Run Jest tests
```

## Frontend Architecture

### Component Architecture
- **Page Components**: HomePage, ApodPage, NeoPage
- **Feature Components**: APOD and NEO specific components
- **Layout Components**: Header, MainLayout, PageLayout
- **UI Components**: Reusable components like ErrorBoundary, LoadingSkeleton

### State Management with React Query
The application uses React Query for:
- **Data Fetching**: Automatic background refetching
- **Caching**: Intelligent cache management with stale-while-revalidate
- **Loading States**: Built-in loading and error states
- **Optimistic Updates**: Smooth user experience

### Custom Hooks
- **useApiQuery**: Base hook for API calls
- **useApod**: APOD-specific queries (today, date, random, range)
- **useNeo**: NEO-specific queries (feed, today, stats, by ID)

### Styling with TailwindCSS
- **Utility-First**: Rapid UI development
- **Responsive Design**: Mobile-first responsive breakpoints
- **Custom Theme**: Space-themed color palette
- **Dark Mode Ready**: Prepared for dark mode implementation

## Backend Architecture

### API Features
- **APOD API**: Astronomy pictures with date filtering and random selection
- **NEO API**: Near-earth object data with date ranges and detailed information
- **Caching**: In-memory caching for improved performance
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Comprehensive error handling with detailed responses
- **Input Validation**: Request validation middleware for data integrity

### Code Quality Standards
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Jest**: Comprehensive test suite
- **TypeScript**: Type safety throughout

### Testing Coverage
- API endpoints and responses
- Error handling scenarios
- Input validation
- Caching functionality
- Service layer logic

## Caching Strategy

The application implements intelligent caching at multiple levels:

- **APOD Data**: 10 minutes (600s)
- **NEO Feed**: 10 minutes (600s)
- **NEO Today**: 30 minutes (1800s)
- **NEO Statistics**: 1 hour (3600s)
- **Random APOD**: 5 minutes (300s)
- **APOD Range**: 15 minutes (900s)

## Performance Optimizations

### Frontend
- **Code Splitting**: Route-based and component-level splitting
- **Image Optimization**: Lazy loading and responsive sizing
- **React Query Cache**: Intelligent data caching and background updates

### Backend
- **In-Memory Caching**: Fast data retrieval with configurable TTL
- **Rate Limiting**: Prevents API abuse and ensures stability
- **Error Handling**: Graceful error recovery and user feedback

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Render/Railway/Heroku)
```bash
cd backend
npm run build
# Deploy with environment variables configured
```

### Environment Variables for Production
- `NASA_API_KEY`: Your NASA API key
- `PORT`: Server port (usually provided by hosting service)
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your frontend domain

## NASA API Integration

This application integrates with:
- **APOD API**: Astronomy Picture of the Day
- **NEO API**: Near Earth Object Web Service

Get your free NASA API key at: https://api.nasa.gov
