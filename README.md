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
- **AI-Generated Email System** - Curriculum-specific welcome emails with personalized content

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
│   ├── students/
│   │   ├── page.tsx            # Students signup page
│   │   └── offer/
│   │       └── page.tsx        # Curriculum selection page
│   └── api/
│       ├── signup/
│       │   └── route.ts        # Mock API endpoint
│       ├── students-signup/
│       │   └── route.ts        # Students signup API
│       ├── curriculum-signup/
│       │   └── route.ts        # Curriculum-specific email API
│       ├── catalog/
│       │   └── route.ts        # GoDaddy Catalog API proxy
│       ├── orders/
│       │   └── route.ts        # GoDaddy Orders API proxy
│       └── fulfillFree/
│           └── route.ts        # GoDaddy FulfillFree API proxy
├── components/
│   ├── Benefit.tsx             # Benefit card component
│   ├── Alerts.tsx              # Success/error alert components
│   └── FormParts.tsx           # Password strength component
├── lib/
│   ├── schools.ts              # School and curriculum data
│   ├── password.ts             # Password validation utilities
│   └── email-generator.ts      # AI email generation system
├── EMAIL_SETUP.md              # Email configuration guide
├── env.example                 # Environment variables template
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

### Students Page (`/students`)
- **Student-focused signup form** with:
  - School selection dropdown (ASU, UArizona, NAU, ISBAT, or custom)
  - Email input with domain validation
  - Authentication and JWT token generation
  - Redirect to curriculum selection page
- **No email sending** - emails are sent only when curriculum is selected

### Students Offer Page (`/students/offer`)
- **Curriculum selection interface** with:
  - Three curated curriculum options:
    - **Web Design** - Web Hosting Economy, Conversations Essentials
    - **Website Security** - MWP Basic, Norton Small Business Standard  
    - **Building Businesses with AI** - WAM Commerce, Airo Plus
  - **Curriculum-specific email sending** when "Select" button is clicked
  - **Personalized welcome emails** with AI-generated content based on selected curriculum

## 📧 Email System

### AI-Generated Welcome Emails
The application includes a sophisticated email system that sends personalized welcome emails when students select their curriculum:

#### **Email Features:**
- **AI Name Parsing** - Intelligently extracts and formats student names from email addresses
- **Curriculum-Specific Content** - Each curriculum generates tailored email content
- **School Context** - Emails include school-specific benefits and information
- **BCC Recipients** - Emails sent to team members via BCC for privacy
- **SMTP Integration** - Real email sending via Nodemailer with Gmail SMTP

#### **Supported Name Formats:**
- `firstname.lastname@domain.edu` → "Hi Firstname!"
- `firstname_lastname@domain.edu` → "Hi Firstname!"
- `firstname-lastname@domain.edu` → "Hi Firstname!"
- `firstname+lastname@domain.edu` → "Hi Firstname!"
- `initial.lastname@domain.edu` → "Hello Lastname!"
- `firstname@domain.edu` → "Hi Firstname!" (for names >4 characters)

#### **Curriculum-Specific Content:**
- **Web Design**: Focus on HTML/CSS/JS projects and portfolio development
- **Website Security**: Emphasis on security best practices and monitoring tools
- **AI Business**: Highlighting AI-powered business solutions and e-commerce platforms

#### **Email Recipients:**
- dann@godaddy.com
- qwu@godaddy.com
- sbhandarkar@godaddy.com
- nkansal@godaddy.com
- dann@spohn.me

### Email Setup
See `EMAIL_SETUP.md` for detailed configuration instructions including:
- SMTP server setup
- Gmail App Password configuration
- Environment variable setup
- Testing and troubleshooting

## 🔗 GoDaddy API Integration

### Production API Proxies
The application includes production-ready API proxies that connect to GoDaddy's internal services:

#### **Authentication**
- **JWT Token Management** - Secure token handling via `lib/auth.ts`
- **SSO Integration** - Single Sign-On authentication with GoDaddy systems
- **Customer ID Extraction** - Automatic customer identification from JWT tokens

#### **API Endpoints**
- **Catalog API** (`/api/catalog`) - Fetches available student offers and pricing
- **Orders API** (`/api/orders`) - Creates student orders with basket management
- **FulfillFree API** (`/api/fulfillFree`) - Fulfills free student orders automatically

#### **Production Features**
- **Idempotency** - Prevents duplicate orders with unique ID handling
- **Error Handling** - Comprehensive error responses and logging
- **Rate Limiting** - Built-in protection against API abuse
- **Logging** - Detailed request/response logging for debugging

#### **Environment Configuration**
```bash
# Required for GoDaddy API integration
JWT_TOKEN=your-jwt-token
API_BASE_URL=https://api.test.godaddy.com
```

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

### POST `/api/students-signup`
Students signup API endpoint (no email sending).

**Request Body:**
```json
{
  "schoolId": "asu",
  "email": "student@asu.edu"
}
```

**Response:**
```json
{
  "status": "ok|error",
  "message": "Students signup successful! Please select your curriculum to receive your welcome email."
}
```

### POST `/api/curriculum-signup`
Curriculum-specific email sending API endpoint.

**Request Body:**
```json
{
  "offerId": "hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential",
  "schoolId": "asu",
  "email": "student@asu.edu",
  "customerId": "104222",
  "shopperId": "9449896"
}
```

**Response:**
```json
{
  "status": "ok|error",
  "message": "Curriculum-specific welcome email sent for Web Design!"
}
```

**Supported Offer IDs:**
- `hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential` → Web Design
- `hackathonGoStudentsWebsiteSecurity-mwpBasic-nortonSmallBusinessStandard` → Website Security
- `hackathonGoStudentsBusineesAi-wamCommerce-airoAllAccess` → Building Businesses with AI

### POST `/api/catalog`
GoDaddy Catalog API proxy for fetching available offers.

**Request Body:**
```json
{
  "rateForDisplay": true,
  "filters": {
    "offerIds": ["hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential"]
  }
}
```

**Response:**
```json
{
  "offers": [
    {
      "id": "hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential",
      "name": "Web Design Mastery",
      "price": "$0.00",
      "description": "Complete web design toolkit for students"
    }
  ]
}
```

### POST `/api/orders`
GoDaddy Orders API proxy for creating student orders.

**Request Body:**
```json
{
  "idempotentId": "unique-order-id",
  "basketId": "basket-123",
  "customerId": "104222",
  "items": [
    {
      "offerId": "hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "orderId": "order-456",
  "status": "created",
  "customerId": "104222"
}
```

### POST `/api/fulfillFree`
GoDaddy FulfillFree API proxy for fulfilling free student orders.

**Request Body:**
```json
{
  "customerId": "104222",
  "orderId": "order-456",
  "idempotentId": "fulfill-789"
}
```

**Response:**
```json
{
  "status": "fulfilled",
  "orderId": "order-456",
  "fulfillmentId": "fulfill-789"
}

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
# Test original signup API
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"schoolId":"asu","curriculumId":"web101","email":"test@asu.edu","password":"test123"}'

# Test students signup API (no email)
curl -X POST http://localhost:3000/api/students-signup \
  -H "Content-Type: application/json" \
  -d '{"schoolId":"asu","email":"test@asu.edu"}'

# Test curriculum-specific email API
curl -X POST http://localhost:3000/api/curriculum-signup \
  -H "Content-Type: application/json" \
  -d '{"offerId":"hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential","schoolId":"asu","email":"test@asu.edu","customerId":"104222","shopperId":"9449896"}'

# Test GoDaddy Catalog API
curl -X POST http://localhost:3000/api/catalog \
  -H "Content-Type: application/json" \
  -d '{"rateForDisplay":true,"filters":{"offerIds":["hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential"]}}'

# Test GoDaddy Orders API
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"idempotentId":"test-order-123","basketId":"basket-456","customerId":"104222","items":[{"offerId":"hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential","quantity":1}]}'

# Test GoDaddy FulfillFree API
curl -X POST http://localhost:3000/api/fulfillFree \
  -H "Content-Type: application/json" \
  -d '{"customerId":"104222","orderId":"order-456","idempotentId":"fulfill-789"}'
```

### Email Testing
1. **Setup Email Configuration**:
   - Copy `env.example` to `.env.local`
   - Configure SMTP settings (see `EMAIL_SETUP.md`)
   - Test with Gmail App Password

2. **Test Email Flow**:
   - Navigate to `/students`
   - Select school and enter email
   - Click "Get Your Free Tools" → No email sent
   - Navigate to `/students/offer`
   - Click any "Select" button → Email sent with curriculum-specific content

3. **Verify Email Content**:
   - Check recipient inboxes for personalized emails
   - Verify AI name parsing works correctly
   - Confirm curriculum-specific content is included

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

### ✅ API Endpoints
- [x] `/api/signup` - Accepts POST requests with JSON payload
- [x] `/api/students-signup` - Students signup without email sending
- [x] `/api/curriculum-signup` - Curriculum-specific email sending
- [x] `/api/catalog` - GoDaddy Catalog API proxy for fetching offers
- [x] `/api/orders` - GoDaddy Orders API proxy for creating orders
- [x] `/api/fulfillFree` - GoDaddy FulfillFree API proxy for order fulfillment
- [x] Supports query parameters for testing
- [x] Returns appropriate success/error responses
- [x] Implements configurable latency simulation
- [x] JWT authentication integration with GoDaddy APIs

### ✅ Email System
- [x] AI name parsing from email addresses
- [x] Curriculum-specific email content generation
- [x] SMTP integration with Gmail
- [x] BCC email sending to team members
- [x] Email sending triggered on curriculum selection
- [x] Comprehensive email setup documentation

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

### Email System
- **AI Name Parsing**: Intelligent extraction and formatting of student names
- **Curriculum-Specific Content**: Tailored email content based on selected learning path
- **SMTP Integration**: Real email sending with Gmail SMTP
- **BCC Privacy**: Team notifications without exposing recipient lists
- **Comprehensive Documentation**: Detailed setup and troubleshooting guides

## 🔮 Future Enhancements

- **Real SSO Integration**: Connect to actual school authentication systems
- **Email Verification**: Implement email verification flow
- **Database Integration**: Add persistent data storage
- **Analytics**: Track user interactions and conversion rates
- **A/B Testing**: Framework for testing different signup flows

## 📄 License

This project is created for demonstration purposes as part of the GoStudents for the GenAI Hackathon. 