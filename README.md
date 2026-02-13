# FarmAI — AI-Powered Personal Farming Assistant

FarmAI is an intelligent digital companion for farmers, offering personalized, real-time insights for crop management. It combines crop monitoring, disease detection, weather analysis, and smart alerts into a unified, accessible platform with voice and multilingual support.

![FarmAI Banner](client/src/app/icon.svg)

## 🚀 Features

- **Personalized Onboarding**: Tailored crop profiles based on location, farm size, and soil type.
- **AI Disease Detection**: Snap a photo of a leaf to identify diseases and get treatment advice.
- **Smart Weather Insights**: Real-time hyper-local weather updates and farming recommendations.
- **Crop Health Dashboard**: Visual timeline of crop growth, risks, and required actions.
- **Voice & Multilingual Support**: Interact via voice in regional languages.
- **Smart Alerts**: Proactive notifications for irrigation, pests, and adverse weather.

---

## 🛠️ Tech Stack

### Client (Frontend)

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Design System**: Custom premium theme (Inter/Lora fonts, Lucide icons, layered surfaces)
- **State Management**: Zustand
- **Authentication**: Clerk (Google Login)

### Server (Backend)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Vercel AI SDK
- **Storage**: Cloudinary (for leaf images)

---

## 📂 Project Structure

```
.
├── client/                 # Next.js Frontend
│   ├── src/app/           # App Router pages & layout
│   ├── src/components/    # Reusable UI components
│   └── public/            # Static assets
│
└── server/                 # Express Backend
    ├── src/models/        # Mongoose schemas
    ├── src/routes/        # API endpoints
    └── src/services/      # Business logic & AI integration
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/farmai.git
cd farmai
```

### 2. Setup Client

```bash
cd client
npm install
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

### 3. Setup Server

```bash
cd ../server
npm install
# Create .env
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/farmai" >> .env
npm run dev
```

The client will run on [http://localhost:3000](http://localhost:3000) and the server on [http://localhost:5000](http://localhost:5000).

---

## 🎨 Design System

FarmAI uses a **nature-inspired premium design system**:

- **Primary**: Vivid Emerald Green (`#1a9a6b`)
- **Accent**: Punchy Tangerine (`#f97316`)
- **Typography**: Inter (UI) + Lora (Headings) + JetBrains Mono (Data)
- **Theme**: Light mode default with warm cream backgrounds (`#fbfaf8`)

---

## 📚 Documentation

- [Project Documentation (PDF)](docs/project-docs.pdf)

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
