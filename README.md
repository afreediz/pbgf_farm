# 🌾 AgriConnect Marketplace

A B2B Agricultural Marketplace application that connects buyers with local farmers. Buyers can submit product requirements, and the system automatically notifies farmers who grow those products.

## 📸 Features

- **Clean & Responsive Design**: Beautiful agriculture-themed UI with gradient backgrounds
- **Form Validation**: Client-side validation for all required fields
- **Smart Matching**: Automatically matches product requirements with farmers
- **Email Notifications**: Configurable email system (actual sending or console logging)
- **Real-time Feedback**: Success/error messages with farmer notification details

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- Nodemailer
- CORS
- dotenv

## 📁 Project Structure

```
agriconnect/
├── client/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Gmail account (only if sending actual emails)

### Backend Setup

1. **Navigate to backend directory and install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file in backend directory:**
```bash
cp .env.example .env
```

3. **Configure `.env` file:**

**For Development (Console Logging Only):**
```env
PORT=5000
SEND_EMAIL=false
EMAIL_USER=
EMAIL_PASSWORD=
```

**For Production (Actual Email Sending):**
```env
PORT=5000
SEND_EMAIL=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

> **Note**: For Gmail, you need to generate an App Password:
> 1. Go to https://myaccount.google.com/apppasswords
> 2. Generate a new app password
> 3. Use that password in EMAIL_PASSWORD field

4. **Start the backend server:**
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory and install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure Tailwind CSS:**

Create `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. **Update `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

4. **Update `src/App.js` with the React component provided**

5. **Start the frontend development server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🧪 Test Cases

### Test Case 1: Fresh Potato (500kg)
**Expected**: Notify 1 farmer (John Smith)

1. Enter Product: "Fresh Potato"
2. Enter Quantity: 500
3. Select a future delivery date
4. Click Submit
5. **Result**: Should show success message with John Smith notified

### Test Case 2: Organic Tomato (200kg)
**Expected**: Notify 2 farmers (Maria Garcia + David Chen)

1. Enter Product: "Organic Tomato"
2. Enter Quantity: 200
3. Select a future delivery date
4. Click Submit
5. **Result**: Should show success message with both farmers notified

### Test Case 3: Carrot (100kg)
**Expected**: No farmers found message

1. Enter Product: "Carrot"
2. Enter Quantity: 100
3. Select a future delivery date
4. Click Submit
5. **Result**: Should show message that no matching farmers were found

## 📊 Mock Farmer Data

The system includes the following mock farmers:

| Name | Email | Product |
|------|-------|---------|
| John Smith | john.potato@farm.com | Potato |
| Maria Garcia | maria.tomato@farm.com | Tomato |
| David Chen | david.tomato@farm.com | Tomato |

## 🔍 API Endpoints

### POST `/api/requirements`
Create a new product requirement and notify matching farmers.

**Request Body:**
```json
{
  "product": "Fresh Potato",
  "quantity": 500,
  "deliveryDate": "2024-12-31",
  "notes": "Organic preferred"
}
```

**Response:**
```json
{
  "message": "Successfully notified 1 farmer about your requirement!",
  "notifiedFarmers": [
    {
      "name": "John Smith",
      "email": "john.potato@farm.com"
    }
  ],
  "requirement": {
    "id": 1,
    "product": "Fresh Potato",
    "quantity": 500,
    "deliveryDate": "2024-12-31",
    "notes": "Organic preferred",
    "createdAt": "2024-11-06T10:30:00.000Z"
  }
}
```

### GET `/api/requirements`
Get all submitted requirements.

### GET `/api/farmers`
Get all farmers in the system.

### GET `/health`
Health check endpoint.

## 📧 Email Configuration

### Console Logging (Development)
Set `SEND_EMAIL=false` in `.env`. Emails will be logged to console in this format:

```
============================================================
EMAIL TO: John Smith (john.potato@farm.com)
============================================================
Hi John Smith,

A buyer needs Fresh Potato (500kg) by December 31, 2024.

Notes: Organic preferred

Please contact the buyer if you can fulfill this requirement.

Best regards,
AgriConnect Marketplace
============================================================
```

### Actual Email Sending (Production)
1. Set `SEND_EMAIL=true` in `.env`
2. Configure Gmail credentials
3. Enable 2-Step Verification on your Gmail account
4. Generate an App Password
5. Use the App Password in `EMAIL_PASSWORD`

## 📝 Notes

- The application uses in-memory storage (no database required)
- Farmer matching is case-insensitive
- Past delivery dates are blocked by validation
- Notes field is optional