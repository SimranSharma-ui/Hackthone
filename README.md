# HealthLens - Medical Report Analysis App

A modern web application that helps users understand their medical reports through AI-powered explanations and health trend tracking.

## Features

### 🤖 AI-Powered Explanations
- Upload medical reports (PDF, images, documents)
- Get complex medical terms explained in simple language
- Understand what your test results mean for your health

### 📊 Health Trend Tracking
- Compare reports over time
- Visualize how your health metrics change
- Identify patterns and trends in your health data

### 🔒 Secure & Private
- Your medical data is encrypted and private
- HIPAA-compliant security measures
- No data sharing with third parties

## Supported Report Types

1. **CBC (Complete Blood Count)** 🩸
   - Hemoglobin, WBC, RBC, Platelets, etc.

2. **Lipid Profile** 💊
   - Total Cholesterol, LDL, HDL, Triglycerides

3. **Blood Sugar** 🍬
   - Fasting Glucose, HbA1c

## Pages

1. **Onboarding** (`/`) - Landing page with app overview
2. **Sign Up** (`/signup`) - Create a new account
3. **Login** (`/login`) - Sign in to existing account
4. **Dashboard** (`/dashboard`) - Overview of all reports and health stats
5. **Upload Report** (`/upload`) - Upload new medical reports (CBC, Lipid, Blood Sugar)
6. **Report Details** (`/report/:id`) - View detailed AI analysis of a specific report
7. **Trends Analysis** (`/trends`) - Track health metrics over time

## Tech Stack

- **React 19** - UI framework
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool

## Getting Started

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
# VITE_API_BASE_URL=http://localhost:3000/api

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Requirements

The frontend expects a REST API backend. See `API_DOCUMENTATION.md` for complete API specifications.

**Required Endpoints:**
- `POST /api/reports/upload` - Upload and analyze reports
- `GET /api/reports` - Get all user reports
- `GET /api/reports/:id` - Get report details
- `POST /api/reports/compare` - Compare two reports

## Project Structure

```
src/
├── pages/
│   ├── Onboarding.jsx      # Landing page
│   ├── Login.jsx           # Login page
│   ├── SignUp.jsx          # Registration page
│   ├── Dashboard.jsx       # Main dashboard
│   ├── UploadReport.jsx    # Report upload interface
│   ├── ReportDetails.jsx   # Individual report analysis
│   └── TrendsAnalysis.jsx  # Health trends visualization
├── componants/
│   ├── Header.jsx          # Navigation header
│   ├── FloatingInput.jsx   # Form input component
│   └── Title.jsx           # Title component
├── App.jsx                 # Main app component with routing
└── main.jsx               # App entry point
```

## Features in Detail

### Dashboard
- Quick stats overview (total reports, monthly reports, alerts)
- Recent reports list
- Quick action buttons for common tasks

### Upload Report
- Drag-and-drop file upload
- Support for multiple file formats
- Report type and date selection
- AI analysis simulation

### Report Details
- AI-generated summary in plain language
- Detailed breakdown of all test parameters
- Color-coded status indicators (normal, warning, alert)
- Trend indicators for each metric
- Personalized health recommendations

### Trends Analysis
- Select different health metrics to track
- Visual representation of changes over time
- Comparison between first and latest readings
- Key insights and alerts

## Disclaimer

This application is for informational purposes only and does not replace professional medical advice. Always consult with your healthcare provider for medical decisions.
