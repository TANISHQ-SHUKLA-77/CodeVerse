# 🚀 CodeVerse

<div align="center">

**A Modern Q&A Platform for Developers**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.2-47A248)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

_Ask questions, share knowledge, and grow together as a developer community_

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📖 About

CodeVerse is a full-featured Q&A platform designed for developers. It empowers the community to share knowledge, ask questions, and get answers with AI-powered assistance. Built with modern technologies, it offers a seamless user experience with powerful features.

## ✨ Features

### 🔐 Authentication & User Management

- **Multiple Auth Methods**: Email/Password, GitHub OAuth, Google OAuth
- **Secure Sessions**: NextAuth.js for robust session management
- **Profile Management**: Customizable user profiles with stats, badges, and reputation

### 💬 Q&A System

- **Ask Questions**: Rich text editor with markdown support
- **AI-Powered Enhancement**: Auto-generate improved questions using AI
- **Smart Answers**: AI-assisted answer generation and suggestions
- **Tags & Categories**: Organize content with up to 3 tags per question
- **Search & Filter**: Global and local search with multiple filters
- **Voting System**: Upvote/downvote questions and answers
- **Collections**: Save favorite questions for later

### 🎨 Modern UI/UX

- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Instant notifications and toast messages
- **Loading States**: Smooth loading animations
- **Accessible**: Built with accessibility in mind

### 🤖 AI Features

- **Question Improvement**: AI-powered question enhancement
- **Answer Generation**: Smart answer suggestions
- **Free AI Model**: Uses Hugging Face's free AI API

### 📊 Analytics & Insights

- **User Statistics**: Track reputation, badges, and activity
- **Question Analytics**: View counts, votes, and engagement
- **Top Contributors**: See community leaders
- **Hot Questions**: Trending content discovery

### 🔍 Advanced Search

- **Global Search**: Search across all content (questions, answers, users, tags)
- **Local Search**: Search within specific pages
- **Smart Filters**: Filter by newest, popular, unanswered, or recommended
- **Tag Browsing**: Explore questions by tags

## 🎯 Tech Stack

### Frontend

- **Next.js 15.3.1**: React framework with App Router
- **React 19**: Latest React features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **NextAuth.js v5**: Authentication framework
- **Server Actions**: Type-safe server mutations

### AI & External Services

- **Hugging Face API**: Free AI model for content generation
- **bcrypt**: Password hashing
- **Pino**: High-performance logging

### Developer Experience

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Git

### Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codeverse.git
   cd codeverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your actual values.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/codeverse.git
   cd codeverse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   AUTH_SECRET=your_auth_secret_key
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
codeverse/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── cards/            # Card components
│   ├── forms/            # Form components
│   ├── navigation/       # Navigation components
│   └── ui/               # UI components
├── database/             # MongoDB models
├── lib/                  # Utility functions
│   ├── actions/         # Server actions
│   └── handlers/        # API handlers
├── public/              # Static assets
└── types/               # TypeScript types
```

## 🎨 Key Features Implementation

### Authentication Flow

1. User signs up with email/password or OAuth provider
2. Session created and managed by NextAuth
3. Protected routes verify authentication
4. User profile accessible via session

### Question Creation Flow

1. User navigates to "Ask a Question"
2. Fills title, content, and tags
3. Optionally uses AI to improve the question
4. Question saved to database with metadata
5. Tags automatically created/updated
6. User redirected to question page

### AI Integration

- Uses Hugging Face's free Inference API
- Model: Google FLAN-T5 Large
- No API key required for basic usage
- Fast response times with fallback error handling

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security

- Password hashing with bcrypt
- CSRF protection with NextAuth
- SQL injection prevention (MongoDB ODM)
- XSS protection (React auto-escaping)
- Secure session management
- Environment variable protection

## 📝 Environment Variables

Required environment variables:

| Variable             | Description               | Example                         |
| -------------------- | ------------------------- | ------------------------------- |
| `MONGODB_URI`        | MongoDB connection string | `mongodb+srv://...`             |
| `AUTH_SECRET`        | NextAuth secret           | Random string                   |
| `AUTH_GITHUB_ID`     | GitHub OAuth client ID    | `Ov23li5x4xZ9suxVK7lk`          |
| `AUTH_GITHUB_SECRET` | GitHub OAuth secret       | `...`                           |
| `AUTH_GOOGLE_ID`     | Google OAuth client ID    | `...apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Google OAuth secret       | `GOCSPX-...`                    |

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Kill process on port 3000
npx kill-port 3000
```

**MongoDB connection issues**

- Check your connection string format
- Ensure your IP is whitelisted (MongoDB Atlas)
- Verify network connectivity

**Authentication not working**

- Verify OAuth credentials
- Check callback URLs in provider settings
- Ensure AUTH_SECRET is set

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Hugging Face](https://huggingface.co/) - AI model hosting
- All contributors who help improve this project

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/codeverse](https://github.com/yourusername/codeverse)
- **Issues**: [GitHub Issues](https://github.com/yourusername/codeverse/issues)

---

<div align="center">

**Made with ❤️ by the CodeVerse Team**

⭐ Star us on GitHub if you find this project helpful!

</div>
