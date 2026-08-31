# 🍱 Annsetu (अन्न दान महा दान)

> **AI-Powered Surplus Food Rescue & NGO Coordination Platform**  
> *Connecting food donors with verified NGOs to eliminate hunger and combat food waste in India.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-annsetu.online-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://www.annsetu.online/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Ayush--soni--12%2Fannsetu-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ayush-soni-12/annsetu)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

---

## 🌟 Live Demo & Links

- 🌐 **Live Web Application:** [https://www.annsetu.online/](https://www.annsetu.online/)
- 💻 **GitHub Repository:** [https://github.com/Ayush-soni-12/annsetu](https://github.com/Ayush-soni-12/annsetu)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Future Roadmap](#-future-roadmap)
- [Authors & Contributors](#-authors--contributors)
- [License](#-license)

---

## 🎯 About the Project

In India, millions of people face food insecurity daily, while massive quantities of edible surplus food from weddings, restaurants, caterers, and households are wasted.

**Annsetu** is a modern, production-grade MERN stack application integrated with **Google Gemini AI Vision** designed to bridge this critical gap. It automates food donation verification, streamlines NGO coordination, tracks environmental and community impact, and ensures surplus food reaches those in need safely and efficiently.

---

## ✨ Key Features

### 🤖 1. AI-Powered Food Safety Verification (Gemini 2.5 Flash)
- **Computer Vision Inspection:** Instant image analysis of food donations using Google Gemini AI Vision.
- **Spoilage & Mismatch Detection:** Automatically checks for visual spoilage, mold, unhygienic packaging, or text-image mismatches (e.g., claiming *dal* but displaying *meat*).
- **Safety Score & Verdict:** Generates a structured safety score (0–100) and explicit verdict (`SAFE`, `CAUTION`, `REJECT`) prior to donation confirmation.

### 📊 2. Real-Time Impact Dashboard & Analytics
- Metrics for total meals served, active donations, successful deliveries, and estimated $\text{CO}_2$ emissions prevented.
- Dynamic visual charts powered by **Recharts** and fluid UI micro-animations with **Framer Motion**.

### 🏢 3. NGO Directory & Automated Matching
- Searchable directory of verified NGOs with capacity, service area, and dietary preference filters.
- Intelligent algorithm matching donors with nearby NGOs for prompt pick-ups.

### 🛡️ 4. Resilient & High-Performance Architecture
- **Zod Schema Validation:** Strict runtime validation on incoming API requests.
- **JWT & Role-Based Auth:** Secure token-based authentication for Donors, NGOs, and Admins.
- **Redis Caching & Resilience:** Integrated Redis container support and custom middleware for load-shedding and rate limiting under surge traffic.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI framework |
| **Vite** | Lightning-fast build tool & dev server |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **TanStack Query v5** | Server state management & caching |
| **Framer Motion** | Micro-animations and interactive feedback |
| **Recharts** | Interactive dashboard visualizations |
| **Axios** | HTTP client with automatic JWT handling |
| **Lucide React** | Sleek icon set |

### **Backend & Infrastructure**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express.js** | Core REST API web framework |
| **MongoDB & Mongoose** | Document database & object modeling |
| **Redis** | In-memory caching and session management |
| **Google Gemini AI SDK** | Vision AI model for food quality inspection |
| **Zod** | Schema and data payload validation |
| **JWT & Cookie-Parser** | Secure authentication management |
| **Cloudinary & Multer** | Image processing & CDN distribution |
| **Resend** | Transactional email notifications |
| **Docker** | Containerized Redis infrastructure |

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |    React + Vite Client|
                                  |  (annsetu.online UI)  |
                                  +-----------+-----------+
                                              |
                                              | REST API (JWT + Axios)
                                              v
                                  +-----------+-----------+
                                  |  Express.js Backend   |
                                  | (Zod + NeuralControl) |
                                  +-----+-----+-----+-----+
                                        |     |     |
            +---------------------------+     |     +---------------------------+
            |                           |                               |
            v                           v                               v
 +----------+----------+     +----------+----------+         +----------+----------+
 |   MongoDB Database  |     | Google Gemini 2.5   |         | Cloudinary & Resend |
 | (Users, Donations,  |     |   (AI Vision API)   |         | (CDN Storage & Mail)|
 |     NGO Data)       |     +---------------------+         +---------------------+
 +---------------------+                |
                                        v
                             +----------+----------+
                             |   Redis Container   |
                             |  (Cache & Rate Lim) |
                             +---------------------+
```

---

## 🚀 Getting Started & Local Setup

Follow these steps to run Annsetu locally on your machine.

### 📋 Prerequisites
- **Node.js** (v18.x or higher) & **npm**
- **MongoDB** (Local instance or MongoDB Atlas)
- **Docker** (Optional, for running Redis locally)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ayush-soni-12/annsetu.git
cd annsetu
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

#### Configure Environment Variables
Create a `.env` file inside the `Backend/` directory (refer to the [Environment Variables](#-environment-variables) section below).

#### Start Redis (Optional via Docker)
```bash
docker-compose up -d
```

#### Run Backend Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```
*The backend server will run at `http://localhost:3000`.*

---

### 3️⃣ Frontend Setup

Open a new terminal tab and navigate to the frontend directory:

```bash
cd annsetu
npm install
```

#### Run Frontend Dev Server
```bash
npm run dev
```
*The frontend application will run at `http://localhost:5173`.*

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/annsetu
JWT_SECRET_KEY=your_jwt_secret_key_here

# AI Service Keys
GEMINI_API_KEY=your_google_gemini_api_key

# Redis Configuration
REDIS_URL=redis://localhost:6380

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Resend Transactional Email
RESEND_API_KEY=your_resend_api_key
```

### Frontend (`annsetu/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 📑 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user (Donor/NGO) | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return token | ❌ |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | ✅ |
| `GET` | `/api/donations` | List surplus food donations | ❌ |
| `POST` | `/api/donations` | Create a new food donation listing | ✅ |
| `POST` | `/api/ai/analyze-food` | Run Gemini Vision AI safety check | ✅ |
| `GET` | `/api/ngos` | List registered & verified NGOs | ❌ |
| `GET` | `/api/stats` | Fetch impact dashboard statistics | ❌ |
| `POST` | `/api/upload` | Upload food image to Cloudinary CDN | ✅ |

---

## 🗺️ Future Roadmap

- [x] **Phase 1:** MERN Core & Donor Workflow Architecture
- [x] **Phase 2:** NGO Directory & Custom Domain Deployment (`annsetu.online`)
- [x] **Phase 3:** Gemini 2.5 Flash Vision AI Food Safety Verification
- [ ] **Phase 4:** Anna AI Multilingual Chatbot Assistant for Donors & NGOs
- [ ] **Phase 5:** Socket.io Real-Time Live Donation Tracking & Route Optimization
- [ ] **Phase 6:** Mobile Progressive Web App (PWA) / React Native Mobile App

---

## 👥 Authors & Contributors

### Lead Developer & Creator
- **Ayush Soni**
  - 🌐 **Live Project:** [annsetu.online](https://www.annsetu.online/)
  - 💻 **GitHub:** [@Ayush-soni-12](https://github.com/Ayush-soni-12)
  - 💼 **LinkedIn:** [Ayush Soni](https://www.linkedin.com/)

### Contributors
- **Kunal Gupta** — 💻 **GitHub:** [@kunalgupta78612](https://github.com/kunalgupta78612)

> 💼 **Open to Opportunities!**  
> *I am actively seeking Full-Stack / Software Engineering roles! Feel free to reach out if you are hiring or would like to collaborate.*

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

⭐ **If you find this project impactful, please consider giving it a star on GitHub!**


