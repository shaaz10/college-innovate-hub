# VJ Hub Backend API

A comprehensive Express.js backend with MongoDB and Google SSO for the VJ Hub college startup community platform.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth 2.0 integration
  - Role-based access control (student, faculty, admin)
  - Session management

- **Database Models**
  - Users with profiles and social links
  - Problems with voting and tagging
  - Ideas linked to problems with team management
  - Startups with funding tracking and milestones
  - Comments system with replies and likes

- **API Endpoints**
  - RESTful API design
  - Comprehensive filtering and pagination
  - File upload support (Cloudinary integration)
  - Real-time voting system
  - Advanced search capabilities

- **Security & Performance**
  - Rate limiting
  - CORS configuration
  - Input validation and sanitization
  - Error handling and logging
  - Database indexing for performance

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials

### Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/vjhub
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Session
   SESSION_SECRET=your-session-secret-here
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Problems Endpoints

- `GET /api/problems` - Get all problems (with filtering)
- `GET /api/problems/:id` - Get single problem
- `POST /api/problems` - Create new problem (auth required)
- `PUT /api/problems/:id` - Update problem (author only)
- `DELETE /api/problems/:id` - Delete problem (author only)
- `POST /api/problems/:id/vote` - Vote on problem (auth required)
- `DELETE /api/problems/:id/vote` - Remove vote (auth required)

### Ideas Endpoints

- `GET /api/ideas` - Get all ideas (with filtering)
- `GET /api/ideas/:id` - Get single idea
- `POST /api/ideas` - Create new idea (auth required)
- `PUT /api/ideas/:id` - Update idea (author only)
- `DELETE /api/ideas/:id` - Delete idea (author only)
- `POST /api/ideas/:id/vote` - Vote on idea (auth required)
- `DELETE /api/ideas/:id/vote` - Remove vote (auth required)

### Startups Endpoints

- `GET /api/startups` - Get all startups (with filtering)
- `GET /api/startups/:id` - Get single startup
- `POST /api/startups` - Create new startup (auth required)
- `PUT /api/startups/:id` - Update startup (founder only)
- `DELETE /api/startups/:id` - Delete startup (founder only)
- `POST /api/startups/:id/vote` - Upvote startup (auth required)
- `PUT /api/startups/:id/milestones/:index` - Update milestone (founder only)

### Comments Endpoints

- `GET /api/comments` - Get comments for target
- `POST /api/comments` - Create new comment (auth required)
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author only)
- `POST /api/comments/:id/like` - Like/unlike comment (auth required)

## Database Schema

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  avatar: String,
  university: String,
  role: ['student', 'faculty', 'admin'],
  googleId: String,
  isEmailVerified: Boolean,
  bio: String,
  skills: [String],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  }
}
```

### Problem Model
```javascript
{
  title: String,
  excerpt: String,
  description: String,
  image: String,
  author: ObjectId (User),
  tags: [String],
  background: String,
  scalability: String,
  marketSize: String,
  competitors: [String],
  currentGaps: String,
  upvotes: [ObjectId (User)],
  downvotes: [ObjectId (User)],
  views: Number,
  status: ['draft', 'published', 'archived'],
  featured: Boolean
}
```

### Idea Model
```javascript
{
  title: String,
  description: String,
  problemId: ObjectId (Problem),
  author: ObjectId (User),
  team: [{
    name: String,
    email: String,
    role: String,
    avatar: String,
    userId: ObjectId (User)
  }],
  stage: Number (1-9),
  mentor: String,
  attachments: [String],
  contact: String,
  upvotes: [ObjectId (User)],
  downvotes: [ObjectId (User)],
  views: Number,
  status: ['draft', 'published', 'archived'],
  featured: Boolean,
  tags: [String],
  businessModel: String,
  targetMarket: String,
  competitiveAdvantage: String,
  fundingNeeds: String,
  timeline: [{
    milestone: String,
    targetDate: Date,
    completed: Boolean
  }]
}
```

### Startup Model
```javascript
{
  name: String,
  description: String,
  ideaId: ObjectId (Idea),
  founder: ObjectId (User),
  team: [{
    name: String,
    role: String,
    avatar: String,
    userId: ObjectId (User)
  }],
  stage: Number (1-9),
  fundingStatus: String,
  fundingAmount: Number,
  schemes: [String],
  upvotes: [ObjectId (User)],
  milestones: [{
    title: String,
    date: Date,
    completed: Boolean,
    description: String
  }],
  onePager: String,
  pitchDeck: String,
  website: String,
  logo: String,
  industry: [String],
  location: String,
  foundedDate: Date,
  employees: Number,
  revenue: Number,
  businessModel: String,
  targetMarket: String,
  competitiveAdvantage: String,
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    facebook: String
  },
  status: ['active', 'acquired', 'closed', 'paused'],
  featured: Boolean,
  views: Number,
  tags: [String]
}
```

### Comment Model
```javascript
{
  content: String,
  author: ObjectId (User),
  targetType: ['Problem', 'Idea', 'Startup'],
  targetId: ObjectId,
  parentComment: ObjectId (Comment),
  likes: [ObjectId (User)],
  isEdited: Boolean,
  editedAt: Date,
  status: ['active', 'deleted', 'hidden']
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.ts    # Environment configuration
│   │   ├── database.ts  # MongoDB connection
│   │   └── passport.ts  # Passport.js configuration
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   └── validation.ts # Input validation
│   ├── models/          # Mongoose models
│   │   ├── User.ts
│   │   ├── Problem.ts
│   │   ├── Idea.ts
│   │   ├── Startup.ts
│   │   └── Comment.ts
│   ├── routes/          # API routes
│   │   ├── auth.ts
│   │   ├── problems.ts
│   │   ├── ideas.ts
│   │   ├── startups.ts
│   │   └── comments.ts
│   └── server.ts        # Main server file
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vjhub
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
SESSION_SECRET=your-production-session-secret
CLIENT_URL=https://yourdomain.com
```

### Build and Start

```bash
npm run build
npm start
```

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens have expiration times
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS is properly configured
- Sensitive data is excluded from API responses
- Environment variables are used for secrets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.