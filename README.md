# Interview Mentor AI 🚀

Interview Mentor AI is a full-stack, AI-powered interview preparation platform designed to help candidates practice smartly and get real, actionable feedback. Whether you are prepping for Data Structures & Algorithms (DSA), Human Resources (HR), or Behavioral rounds, this AI mentor provides dynamic mock interviews tailored just for you.

## ✨ Features

- **Three Specialized Interview Modes**:
  - **DSA Mode**: Test your coding skills! Features a dynamic Proficiency Level Selector (Beginner, Intermediate, Advanced) to serve you customized, randomized algorithm questions.
  - **HR Mode**: Master the STAR format, negotiate salary expectations, and answer tricky professional questions.
  - **Behavioral Mode**: Practice storytelling, leadership qualities, and handling workplace conflict.
- **Clerk Authentication**: Secure frontend user authentication and seamless onboarding.
- **User Profiles**: Profiles are automatically synchronized and backed up via MongoDB Atlas.
- **Gemini AI Integration**: Real-time evaluation, feedback, and structured follow-up questions powered by Google's powerful Gemini 2.5 Flash Lite API.
- **Modern UI Edge**: Built with React, featuring glassmorphic designs, typography powered by Google Sans & Lora, typing animations, and URL-synced routing.

## 🛠️ Tech Stack

### Frontend
- React 19 (via Vite)
- Clerk `@clerk/clerk-react`
- Tailwind CSS & Custom CSS animations
- Native URL routing via Browser History API

### Backend
- Node.js & Express
- Mongoose & MongoDB Atlas (for Database)
- Google Generative AI SDK (Gemini)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account/cluster
- Clerk publishable key
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinay-0913/Interview-Mentor-AI.git
   cd Interview-Mentor-AI
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGO_URI=your_mongodb_atlas_connection_string
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` folder:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Run the App**
   Open `http://localhost:5173` in your browser. Log in, select your interview mode, and crack your next interview!
