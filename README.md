# NeoChat AI - Full Stack Intern Assignment

A professional, full-stack AI chat application built with React, Spring Boot, and Neo4j. This application features secure authentication, real-time AI chat using **Groq (Llama 3)**, and persistent conversation history stored in a graph database.

## Features

- **User Authentication**: Secure Registration and Login with JWT (Access & Refresh Tokens).
- **Real AI Chat**: Integrated with **Groq API** (Llama 3 model) for intelligent, high-speed responses.
- **Conversation History**: Persistent chat history stored in **Neo4j** graph database.
- **Modern UI**: Professional, responsive interface built with **React 19**, **Next.js 15**, and **Tailwind CSS 4**.
- **Robust Security**: HttpOnly cookies (optional) or secure local storage for tokens, with automatic token refresh on expiration.

---

## Tech Stack

### Frontend
- **Framework**: React 19 (Next.js 15 App Router)
- **Styling**: Tailwind CSS 4, Lucide React Icons
- **State Management**: React Context API
- **HTTP Client**: Custom Fetch wrapper with Interceptors

### Backend
- **Framework**: Spring Boot 3.2.4
- **Database**: Neo4j (Graph Database)
- **AI Integration**: Groq API (Llama 3)
- **Security**: Spring Security, JWT (JJWT)
- **Build Tool**: Maven

---

## Prerequisites

- **Node.js**: v18 or higher
- **Java JDK**: v17 or higher
- **Docker**: For running Neo4j
- **Groq API Key**: (Free tier available at console.groq.com)

---

## Quick Start

### 1. Database Setup (Neo4j)

The project uses Docker Compose to run Neo4j.

```bash
cd backend
docker-compose up -d
```

- **Neo4j Browser**: `http://localhost:7474`
- **Username**: `neo4j`
- **Password**: `password123`

### 2. Backend Setup

1.  Open a terminal in the `backend` directory.
2.  Configure your environment variables in `src/main/resources/application.properties` (or leave defaults for local dev).
3.  Run the application:

```bash
# Windows
./mvnw spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup

1.  Open a new terminal in the `frontend` directory.
2.  Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`src/main/resources/application.properties`)

Ensure these are configured correctly. The project comes with defaults, but you should use your own API keys for production.

```properties
# Neo4j Configuration
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=password123

# JWT Configuration
jwt.secret=YOUR_SECURE_SECRET_KEY_MUST_BE_LONG_ENOUGH
jwt.expiration=300000        # 5 minutes (Access Token)
jwt.refresh-expiration=604800000 # 7 days (Refresh Token)

# Groq API Configuration (Real AI)
groq.api.key=YOUR_GROQ_API_KEY
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.model=llama-3.3-70b-versatile
```

### Frontend (`.env.local`)

```properties
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

---

## Testing Instructions

### 1. User Registration
1.  Navigate to `http://localhost:3000/register`.
2.  Enter a unique email (e.g., `test@demo.com`) and password.
3.  Click **Create account**.
4.  **Verification**: You should be redirected to login. If the email exists, you will see "Email is already in use!".

### 2. User Login
1.  Navigate to `http://localhost:3000/login`.
2.  Enter your credentials.
3.  Click **Sign in**.
4.  **Verification**: You will be redirected to the Chat Interface.

### 3. AI Chat (Real Llama 3)
1.  Type a prompt: *"Write a short poem about coding."*
2.  Click **Send**.
3.  **Verification**: You will receive a creative, intelligent response from the AI (not a mock response).
4.  Refresh the page. The conversation history should load from the database.

### 4. Token Refresh (Critical Flow)
This tests the seamless session management.
1.  Open Browser DevTools (**F12**) -> **Application** -> **Local Storage**.
2.  Locate the `accessToken`.
3.  **Action**: Delete the last few characters of the token value to invalidate it.
4.  Send a new message or refresh the page.
5.  **Verification**: 
    - The request will initially fail (401).
    - The app will automatically call `/refresh`.
    - A new `accessToken` will be stored.
    - The original request will retry and succeed.
    - **Result**: You stay logged in and the chat continues uninterrupted.

---

## Project Structure

```
.
├── backend/                # Spring Boot Application
│   ├── src/main/java       # Java Source (com.backend.*)
│   ├── docker-compose.yml  # Neo4j Docker config
│   └── pom.xml            # Maven build file
│
└── frontend/               # Next.js Application
    ├── app/               # Pages (Login, Register, Chat)
    ├── components/        # UI Components (ChatInterface, etc.)
    ├── lib/               # API Client & Services
    └── public/            # Static assets
```
