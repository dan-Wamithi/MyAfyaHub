# AfyaHub - Full-Stack MERN Application

A comprehensive health information platform for Kenyan communities, built with the MERN stack (MongoDB, Express, React, Node.js) using Next.js App Router. This project emphasizes clear separation of concerns, extensive testing, debugging capabilities, and robust error handling.

## 🚀 Features

- **Health Articles**: Access verified health information and medical advice.
- **Vaccination Schedules**: Stay up-to-date with national vaccination guidelines.
- **Emergency Contacts**: Quick access to emergency numbers and health facilities.
- **User Authentication**: Secure login and registration for users and admins.
- **Content Management**: Admin dashboard for managing health articles.
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS.
- **Search & Filter**: Easily find relevant health information.
- **Error Handling**: Comprehensive error boundaries and API error handling.
- **Testing Suite**: Extensive unit and integration tests.
- **Debug Tools**: Built-in debugging utilities and logging.

## 🛠 Tech Stack

### Frontend
- **React 18** with JavaScript (JSX)
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Testing Library** for testing
- **Lucide React** for icons

### Backend
- **Next.js API Routes** (Node.js environment)
- **MongoDB** with native driver
- **Bcrypt.js** for password hashing
- **JSON Web Tokens (JWT)** for authentication
- **Jest** and **Supertest** for API testing

### Testing & Debugging
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Supertest** for API testing
- **Chrome DevTools** integration
- **Node.js Inspector** support
- **Custom debug logging utilities**

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd afyahub-mern
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/afyahub
   JWT_SECRET=your-super-secret-jwt-key # Replace with a strong, random key
   NODE_ENV=development
   \`\`\`

4. **Database Setup**
   
   **Option A: Seed with sample data**
   \`\`\`bash
   node scripts/seed-afyahub.js
   \`\`\`
   This will create sample users and health articles.
   Login credentials:
   - Admin: `admin@afyahub.co.ke` / `admin123`
   - User: `john@example.com` / `user123`
   
   **Option B: Start with empty database**
   The application will automatically create the database and collections on first use.

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

### Running Tests

**Run all tests**
\`\`\`bash
npm test
\`\`\`

**Run tests in watch mode**
\`\`\`bash
npm run test:watch
\`\`\`

**Run tests with coverage**
\`\`\`bash
npm run test:coverage
\`\`\`

**Run specific test files**
\`\`\`bash
# API tests only
npm test -- __tests__/api

# Component tests only  
npm test -- __tests__/components

# Specific test file
npm test -- __tests__/api/bugs.test.js
\`\`\`

### Test Structure

\`\`\`
__tests__/
├── api/
│   └── bugs.test.js          # API endpoint tests
├── components/
│   ├── BugTracker.test.jsx   # Main component tests
│   └── ErrorBoundary.test.jsx # Error boundary tests
└── setup/
    ├── jest.config.js        # Jest configuration
    └── jest.setup.js         # Test setup and mocks
\`\`\`

### Testing Strategy

#### Backend Testing (API Routes)
- **Unit Tests**: Individual API endpoint testing
- **Integration Tests**: Database interaction testing
- **Error Handling**: Testing various error scenarios
- **Validation**: Input validation and sanitization testing

#### Frontend Testing (React Components)
- **Component Rendering**: Testing component output
- **User Interactions**: Testing form submissions, button clicks
- **State Management**: Testing component state changes
- **Error Boundaries**: Testing error handling in UI
- **Integration**: Testing API integration

#### Test Coverage Goals
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

## 🐛 Debugging

### Debug Logging

The application includes comprehensive debug logging:

\`\`\`javascript
import { debugLogger } from '@/server/debug';

// Basic logging
debugLogger.info('User action', { userId: 123 });
debugLogger.warn('Potential issue', { data });
debugLogger.error('Error occurred', error);

// Performance monitoring
debugLogger.time('api-call');
// ... some operation
debugLogger.timeEnd('api-call');
\`\`\`

### Chrome DevTools Integration

**Frontend Debugging:**
1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in React components
4. Use Console for runtime debugging

**Performance Monitoring:**
1. Open Performance tab in DevTools
2. Record application usage
3. Analyze performance marks and measures

### Node.js Inspector (Backend Debugging)

**Enable Inspector:**
\`\`\`bash
# Start with inspector
npm run dev:debug

# Or manually enable
node --inspect-brk=0.0.0.0:9229 node_modules/.bin/next dev
\`\`\`

**Connect Debugger:**
1. Open Chrome and go to `chrome://inspect`
2. Click "Open dedicated DevTools for Node"
3. Set breakpoints in API routes
4. Debug server-side code

### Debug Environment Variables

\`\`\`env
# Enable debug logging
NODE_ENV=development

# Enable verbose logging
DEBUG=*

# MongoDB debug
DEBUG=mongodb:*
\`\`\`

### Common Debugging Scenarios

**API Issues:**
1. Check Network tab in DevTools
2. Verify request/response data
3. Check server logs for errors
4. Use API testing tools (Postman, curl)

**Database Issues:**
1. Check MongoDB connection
2. Verify collection names and indexes
3. Use MongoDB Compass for data inspection
4. Check database logs

**React Issues:**
1. Use React Developer Tools
2. Check component state and props
3. Verify event handlers
4. Use console.log strategically

## 🚨 Error Handling

### Frontend Error Handling

**Error Boundaries:**
- Catch JavaScript errors in component tree
- Display fallback UI for better UX
- Log errors for debugging
- Provide recovery options

**API Error Handling:**
- Network error handling
- HTTP status code handling
- User-friendly error messages
- Retry mechanisms

### Backend Error Handling

**Express Middleware:**
- Global error handling
- Request validation
- Database error handling
- Proper HTTP status codes

**MongoDB Error Handling:**
- Connection error handling
- Validation error handling
- Duplicate key error handling
- Transaction error handling

### Error Types and Responses

\`\`\`javascript
// Validation Error (400)
{
  error: "Validation failed",
  details: "Title is required and must be a non-empty string"
}

// Not Found Error (404)
{
  error: "Bug not found"
}

// Server Error (500)
{
  error: "Internal server error",
  details: "Database connection failed" // Only in development
}
\`\`\`

## 📁 Project Structure

\`\`\`
afyahub-mern/
├── app/                      # Next.js app directory (Frontend UI & API routes)
│   ├── api/                  # API routes (Backend logic)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── bugs/            # Bug-related endpoints
│   │   ├── articles/        # Health article endpoints
│   │   └── contact/         # Contact form submission
│   ├── components/          # React components (UI)
│   │   └── ErrorBoundary.jsx
│   ├── globals.css          # Global styles
│   ├── layout.jsx           # Root layout
│   ├── loading.jsx          # Loading UI
│   ├── page.jsx             # Main page component
│   ├── articles/page.jsx    # Articles page
│   ├── vaccination/page.jsx # Vaccination page
│   ├── emergency/page.jsx   # Emergency contacts page
│   ├── contact/page.jsx     # Contact page
│   ├── login/page.jsx       # Login page
│   └── register/page.jsx    # Register page
├── components/              # shadcn/ui components (e.g., ui/button.jsx, ui/card.jsx)
├── hooks/                   # Custom React hooks (e.g., useAuth.jsx, use-toast.js)
├── server/                  # Server-side utilities (Backend helpers)
│   ├── mongodb.js           # Database connection
│   └── debug.js             # Debug utilities
├── scripts/                 # Utility scripts
│   └── seed-afyahub.js      # Database seeding
├── __tests__/               # Test files
│   ├── api/                 # API tests
│   └── components/          # Component tests
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Test setup
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
\`\`\`

## 🔄 API Endpoints

### Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Log in a user |
| GET    | `/api/auth/me`       | Get current user details (protected) |

### Articles API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/articles`      | Get all health articles (can filter by `featured`, `limit`, `search`, `category`) |
| POST   | `/api/articles`      | Create new health article (Admin only) |
| GET    | `/api/articles/[id]` | Get specific health article |
| PUT    | `/api/articles/[id]` | Update health article (Admin only) |
| DELETE | `/api/articles/[id]` | Delete health article (Admin only) |

### Contact API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/contact`       | Submit a health question/contact form |

## 🎯 Best Practices Implemented

### Code Quality
- JavaScript (JSX) for components
- ESLint and Prettier for code formatting
- Consistent naming conventions
- Comprehensive error handling
- Input validation and sanitization

### Testing
- Test-driven development approach
- High test coverage requirements
- Mock external dependencies
- Test both happy path and error scenarios
- Integration testing for API endpoints

### Security
- Input validation on both client and server
- Password hashing with bcrypt.js
- JWT for secure authentication
- Error message sanitization
- Environment variable protection

### Performance
- Database indexing for common queries
- Efficient React rendering with proper keys
- Lazy loading and code splitting
- Optimized bundle size

### Debugging
- Comprehensive logging system
- Development vs production error handling
- Performance monitoring
- Debug utilities for troubleshooting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Issues:**
- Verify MongoDB is running
- Check connection string in `.env.local`
- Ensure network connectivity
- Check firewall settings

**Test Failures:**
- Clear Jest cache: `npm test -- --clearCache`
- Check for port conflicts
- Verify test database is separate from development
- Update snapshots if needed: `npm test -- -u`

**Build Issues:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for any JavaScript syntax errors.

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the debugging section above
- Enable debug logging for more information
- Use browser DevTools for frontend issues
- Use Node.js inspector for backend issues

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] File attachments for health inquiries
- [ ] Advanced filtering and search for articles
- [ ] Health analytics and reporting
- [ ] Email notifications for inquiries
- [ ] API rate limiting
- [ ] Automated testing with CI/CD
- [ ] Docker containerization
- [ ] Performance monitoring with APM tools
