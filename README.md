# GoStudents by GoDaddy

A production-quality Next.js application showcasing student onboarding flows with comprehensive testing capabilities.

## 🚀 Features

### Tech Stack
- **Next.js 14** with App Router and TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for smooth animations
- **Mock API** for testing without backend dependencies

### Core Features
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Password Strength Validation** - Real-time password requirements checking
- **Form Validation** - Client-side validation with accessible error states
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Mock API Testing** - Built-in testing interface with latency simulation

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page with navigation
│   ├── globals.css             # Global styles and Tailwind setup
│   ├── gostudents/
│   │   └── page.tsx            # Landing page with signup form
│   ├── gostudents-test/
│   │   └── page.tsx            # Test playground with controls
│   └── api/
│       └── signup/
│           └── route.ts        # Mock API endpoint
├── components/
│   ├── Benefit.tsx             # Benefit card component
│   ├── Alerts.tsx              # Success/error alert components
│   └── FormParts.tsx           # Password strength component
├── lib/
│   ├── schools.ts              # School and curriculum data
│   └── password.ts             # Password validation utilities
└── package.json
```

## 🎯 Pages

### Home Page (`/`)
- Clean landing page with navigation to both main features
- Feature overview with tech stack details
- Responsive design with smooth animations

### Landing Page (`/gostudents`)
- **Production-ready signup form** with:
  - School selection dropdown (ASU, UArizona, NAU, or custom)
  - Curriculum selection (dependent on school)
  - Email input with domain display
  - Password field with real-time strength validation
  - Terms and conditions checkbox
  - Form validation and error handling
- **Benefits section** highlighting:
  - Free domain registration
  - Hosting and site builder tools
  - Post-graduation business conversion
- **Responsive layout** - Two columns on desktop, single column on mobile

### Test Playground (`/gostudents-test`)
- **Developer testing interface** with:
  - Test mode toggle (simulate vs real API calls)
  - Outcome selection (success/error)
  - Latency simulation (configurable delay)
  - Verifier selection (SheerID, UNiDAYS, Student Beans, GitHub Education)
  - Real-time console logging
  - Payload preview (when in test mode)
- **Same form as landing page** for consistent testing
- **Log management** with clear logs functionality

## 🔧 API Endpoints

### POST `/api/signup`
Mock API endpoint for testing signup flows.

**Request Body:**
```json
{
  "schoolId": "asu",
  "curriculumId": "web101", 
  "email": "student@asu.edu",
  "password": "securePassword123",
  "verifier": "SheerID",
  "source": "landing"
}
```

**Query Parameters:**
- `latency` (number): Delay in milliseconds (default: 600)
- `outcome` (string): "success" or "error" (default: "success")

**Response:**
```json
{
  "status": "ok|error",
  "message": "Account created! Verify your student email."
}
```

## 🎨 Design System

### Components
- **Benefit**: Icon + text cards for feature highlights
- **Alerts**: Success and error alert components with dismiss functionality
- **PasswordStrength**: Real-time password requirement validation

### Styling
- **TailwindCSS** for utility-first styling
- **Framer Motion** for smooth page transitions and animations
- **Responsive design** with mobile-first approach
- **Accessible color scheme** with proper contrast ratios

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**

### Quick Start
```bash
# 1. Clone or download the repository
git clone <repository-url>
cd GoStudents-

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to http://localhost:3000
```

### Step-by-Step Setup

#### 1. **Install Node.js**
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version` (should show v18+)
- Verify npm: `npm --version`

#### 2. **Get the Project**
```bash
# Option A: Clone with git
git clone <repository-url>
cd GoStudents-

# Option B: Download and extract ZIP
# Extract the ZIP file and navigate to the folder
cd GoStudents-
```

#### 3. **Install Dependencies**
```bash
npm install
```
*This installs all required packages (Next.js, React, TailwindCSS, Framer Motion, etc.)*

#### 4. **Start Development Server**
```bash
npm run dev
```

#### 5. **Open in Browser**
- Open your web browser
- Navigate to: `http://localhost:3000`
- You should see the GoStudents home page!

### Available Scripts
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Troubleshooting

#### **If you get "Cannot find module" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **If port 3000 is busy:**
```bash
# Next.js will automatically use the next available port
# Check the terminal output for the actual URL
```

#### **If you get permission errors:**
```bash
# On macOS/Linux, you might need:
sudo npm install

# Or use npx instead:
npx next dev
```

### Development Server
- **Local**: `http://localhost:3000`
- **Network**: `http://192.168.x.x:3000` (accessible from other devices on your network)
- **Hot Reload**: Changes to code automatically refresh the browser

### What to Expect

#### **When you run `npm run dev`:**
```
▲ Next.js 15.5.6 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.1.246:3000
✓ Starting...
✓ Ready in 769ms
```

#### **When you visit `http://localhost:3000`:**
- You'll see the GoStudents home page with navigation cards
- Two main options: "Landing Page" and "Test Playground"
- Clean, responsive design with smooth animations

#### **When you visit `http://localhost:3000/gostudents`:**
- Production-ready signup form
- School selection dropdown (ASU, UArizona, NAU, or custom)
- Curriculum selection that updates based on school
- Email input with automatic domain display
- Password field with real-time strength validation
- Terms checkbox and submit button

#### **When you visit `http://localhost:3000/gostudents-test`:**
- Developer testing interface
- Test controls panel (mode, outcome, latency, verifier)
- Same signup form as landing page
- Real-time console logging
- Mock API simulation capabilities

## 🧪 Testing

### Manual Testing
1. **Landing Page**: Navigate to `/gostudents`
   - Test form validation
   - Try different school/curriculum combinations
   - Test password strength requirements
   - Submit form and verify API response

2. **Test Playground**: Navigate to `/gostudents-test`
   - Toggle test mode on/off
   - Adjust latency and outcome settings
   - Monitor console logs for payload/response data
   - Test both success and error scenarios

### API Testing
```bash
# Test success scenario
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"schoolId":"asu","curriculumId":"web101","email":"test@asu.edu","password":"test123"}'

# Test error scenario
curl -X POST "http://localhost:3000/api/signup?outcome=error" \
  -H "Content-Type: application/json" \
  -d '{"schoolId":"asu","curriculumId":"web101","email":"test@asu.edu","password":"test123"}'
```

## 📋 Acceptance Criteria

### ✅ Home Page (`/`)
- [x] Renders links to both main pages
- [x] Responsive design with feature overview
- [x] Smooth animations with Framer Motion

### ✅ Landing Page (`/gostudents`)
- [x] Tagline and benefits section present
- [x] Dependent dropdowns (school → curriculum)
- [x] Email domain display updates with school selection
- [x] Custom domain input for "other" school option
- [x] Password strength validation with visual indicators
- [x] Terms checkbox required for submission
- [x] Form validation and error handling
- [x] API integration with success/error states

### ✅ Test Playground (`/gostudents-test`)
- [x] Test controls panel (mode, outcome, latency, verifier)
- [x] Test mode simulation without API calls
- [x] Real-time console logging with timestamps
- [x] Payload preview when in test mode
- [x] API integration when test mode is off
- [x] Clear logs functionality

### ✅ API Endpoint (`/api/signup`)
- [x] Accepts POST requests with JSON payload
- [x] Supports query parameters for testing
- [x] Returns appropriate success/error responses
- [x] Implements configurable latency simulation

## 🎯 Key Features Implemented

### Form Validation
- **Password Strength**: 4-criteria validation (length, case, numbers, symbols)
- **Required Fields**: All form fields are validated
- **Email Format**: Automatic domain display based on school selection
- **Terms Acceptance**: Checkbox must be checked to submit

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Visual Feedback**: Real-time validation, loading states, success/error alerts
- **Smooth Animations**: Framer Motion for page transitions and micro-interactions

### Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Reusable, well-structured components
- **Testing Interface**: Comprehensive testing tools for development
- **Mock API**: No external dependencies for testing

## 🔮 Future Enhancements

- **Real SSO Integration**: Connect to actual school authentication systems
- **Email Verification**: Implement email verification flow
- **Database Integration**: Add persistent data storage
- **Analytics**: Track user interactions and conversion rates
- **A/B Testing**: Framework for testing different signup flows

## 📄 License

This project is created for demonstration purposes as part of the GoStudents for the GenAI Hackathon. 