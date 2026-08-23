# 🍱 Annsetu (अन्न दान महा दान)

> **AI-Powered Surplus Food Rescue & NGO Coordination Platform**  
> *Connecting food donors with verified NGOs to eliminate hunger and combat food waste in India.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-annsetu.online-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://www.annsetu.online/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Ayush--soni--12%2Fannsetu-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ayush-soni-12/annsetu)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

---

## 🌟 Live Demo & Deployment

- 🌐 **Live Website:** [https://www.annsetu.online/](https://www.annsetu.online/)
- 💻 **GitHub Repository:** [https://github.com/Ayush-soni-12/annsetu](https://github.com/Ayush-soni-12/annsetu)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Future Roadmap](#-future-roadmap)
- [Authors & Contributors](#-authors--contributors)

---

## 🎯 About the Project

In India, millions of people suffer from food insecurity every day, yet huge volumes of edible surplus food from weddings, restaurants, caterers, and households are wasted.

**Annsetu** bridges this critical gap. It is a modern, production-ready MERN stack application integrated with **Google Gemini AI Vision** that streamlines surplus food donation. It provides real-time quality verification, NGO matching, impact tracking, and automated workflows to ensure donated food reaches those in need safely and quickly.

---

## ✨ Key Features

### 🤖 1. AI-Powered Food Safety Verification (Gemini 2.5 Flash)
- **Computer Vision Inspection:** Uploaded food photos are instantly analyzed by Google Gemini AI Vision.
- **Spoilage & Mismatch Detection:** Automatically checks for visual spoilage, mold, unhygienic packaging, or text-image mismatches (e.g., claiming *dal* but showing *meat*).
- **Safety Score & Verdict:** Returns a structured score (0–100) and clear verdict (`SAFE`, `CAUTION`, `REJECT`) before allowing donation submission.

### 📊 2. Real-Time Impact Dashboard & Analytics
- Calculates total meals served, active donations, deliveries completed, and estimated $\text{CO}_2$ emissions prevented.
- Dynamic visualizations powered by framer-motion animations and clean dashboard metrics.

### 🏢 3. NGO Directory & Automated Matching
- Directory listing verified NGOs with capacity, location, and dietary preferences.
- Smart matching algorithm connecting donors with the nearest eligible NGO.

### 🛡️ 4. Resilient Backend Engineering
- **Zod Schema Validation:** Strict request payload validation on all endpoints.
- **JWT & Role-Based Auth:** Secure authentication for Donors, NGOs, and Admins.
- **Custom Control-Plane Middleware:** Includes rate-limiting, load-shedding, and circuit-breaker patterns to handle high-traffic surges gracefully.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | UI Library |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Modern utility-first styling |
| **TanStack Query (React Query)** | Client-side state & server caching |
| **Framer Motion / Motion** | Smooth UI micro-animations |
| **Axios** | HTTP client with automatic JWT interceptors |
| **Lucide React** | Modern iconography |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express.js** | Server framework |
| **MongoDB & Mongoose** | Document database & object modeling |
| **Google Gemini AI SDK** | Vision AI for food quality assessment |
| **Zod** | Schema & payload validation |
| **JWT (JSON Web Tokens)** | Authentication & session security |
| **Cloudinary & Multer** | Cloud image upload and processing |
| **Resend** | Automated transactional email notifications |

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |    React + Vite Client|
                                  |  (annsetu.online UI)  |
                                  +-----------+-----------+
                                              |
                                              | REST Requests (JWT + Axios)
                                              v
                                  +-----------+-----------+
                                  |  Express.js Backend   |
                                  | (Zod + Middleware)    |
                                  +-----+-----+-----+-----+
                                        |     |     |
              +-------------------------+     |     +-------------------------+
              |                               |                               |
              v                               v                               v
   +----------+----------+        +-----------+-----------+       +-----------+-----------+
   |   MongoDB Database  |        | Google Gemini 2.5 Flash|       |   Cloudinary Cloud    |
   | (Users, Donations,  |        |  (AI Food Inspection   |       | (Image Storage &      |
   |     NGO Data)       |        |       Engine)         |       |    CDN Delivery)      |
   +---------------------+        +-----------------------+       +-----------------------+
```

---

## 🗺️ Future Roadmap

- [x] Phase 1: MERN Core & Donor Workflow
- [x] Phase 2: NGO Directory & Custom Domain Deployment
- [x] Phase 3: Gemini 2.5 Flash Vision AI Integration
- [ ] Phase 4: Anna AI Multilingual Chatbot Assistant
- [ ] Phase 5: Socket.io Real-Time Live Donation Tracking & Route Optimization
- [ ] Phase 6: Mobile App (PWA / React Native)

---

## 👥 Authors & Contributors

### Lead Developer & Creator
- **Ayush Soni**
  - 🌐 **Live Project:** [annsetu.online](https://www.annsetu.online/)
  - 💻 **GitHub:** [@Ayush-soni-12](https://github.com/Ayush-soni-12)
  - 💼 **LinkedIn:** [Ayush Soni](https://www.linkedin.com/)

### Contributors
- **Kunal Gupta** — 💻 **GitHub:** [@kunalgupta78612](https://github.com/kunalgupta78612)

> 💼 **I am actively seeking Full-Stack / Software Engineering roles!** Feel free to reach out if you are hiring or would like to collaborate.

---

⭐ **If you find this project inspiring, please give it a star on GitHub!**
