# 🔒 Sarahah Project - Anonymous Messaging Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=for-the-badge)

**A secure, scalable anonymous messaging platform built with modern Node.js technologies**

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Security](#-security) • [Architecture](#-architecture)

</div>

---

## 🚀 Features

### 🔐 **Advanced Security**
- **AES-256-CBC Encryption** for sensitive data (phone numbers)
- **RSA Asymmetric Encryption** with 2048-bit keys
- **bcrypt Password Hashing** with configurable salt rounds
- **JWT Authentication** with access & refresh tokens
- **Token Blacklisting** for secure logout
- **OTP Verification** for email confirmation and password reset

### 👤 **User Management**
- Complete user registration with email verification
- Secure login/logout with JWT tokens
- Profile management with encrypted data
- Password reset functionality
- User listing with message population

### 💬 **Anonymous Messaging**
- Send anonymous messages to any user
- Retrieve messages for authenticated users
- MongoDB relationships with population
- Real-time message handling

### 📧 **Email Integration**
- Automated email notifications
- OTP delivery for verification
- Event-driven email system using EventEmitter
- Nodemailer integration

---

## 🛠 Technology Stack

### **Backend Framework**
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **ES6 Modules** - Modern JavaScript syntax

### **Database**
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Advanced Indexing** - Optimized queries
- **Virtual Population** - Efficient relationships

### **Security & Authentication**
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT implementation
- **crypto** - Built-in encryption utilities
- **Custom Encryption Utils** - AES & RSA encryption

### **Utilities**
- **nanoid** - Unique ID generation
- **uuid** - UUID generation for tokens
- **nodemailer** - Email service
- **dotenv** - Environment configuration

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd sarahaProject
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Database
DB_URL_LOCAL=mongodb://localhost:27017/sarahah

# Server
PORT=3000

# JWT Configuration
JWT_SECRET_KEY=your_super_secure_jwt_secret_key_here
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# Encryption
ENCRYPTION_SECRET_KEY=your_32_byte_encryption_key_here
IV_LENGTH=16
SALT_ROUNDS=10

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Start the application**
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Register User
```http
POST /users/add
Content-Type: application/json

{
  "firstName": "john",
  "lastName": "doe",
  "age": 25,
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "gender": "male",
  "phoneNumber": "+1234567890"
}
```

#### Confirm Email
```http
PUT /users/confirm
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "abc123def4"
}
```

#### Sign In
```http
POST /users/signIn
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /users/refreshToken
refreshtoken: your_refresh_token_here
```

#### Logout
```http
POST /users/logout
Authorization: Bearer your_access_token_here
```

### 👤 User Management Endpoints

#### Update Profile
```http
PUT /users/update
Authorization: Bearer your_access_token_here
Content-Type: application/json

{
  "firstName": "jane",
  "lastName": "smith",
  "age": 26,
  "email": "jane.smith@example.com",
  "gender": "female"
}
```

#### Delete Account
```http
DELETE /users/delete
Authorization: Bearer your_access_token_here
```

#### List Users
```http
GET /users/list
```

### 🔑 Password Reset Endpoints

#### Forget Password
```http
POST /users/forgetPassword
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

#### Confirm Password Reset
```http
PUT /users/confirmForgetPassword
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "reset_otp_here",
  "password": "newSecurePassword123"
}
```

### 💬 Messaging Endpoints

#### Send Anonymous Message
```http
POST /messages/sendMessage
Content-Type: application/json

{
  "content": "Your anonymous message here",
  "receiverId": "user_object_id_here"
}
```

#### Get Messages
```http
GET /messages/getMessages
Content-Type: application/json

{
  "receiverId": "user_object_id_here"
}
```

---

## 🔒 Security Features

### **Encryption Implementation**

#### **Symmetric Encryption (AES-256-CBC)**
- Used for phone number encryption
- 256-bit key strength
- CBC mode with random IV
- Secure key derivation from environment variables

#### **Asymmetric Encryption (RSA-2048)**
- Public/Private key pair generation
- 2048-bit key strength
- PKCS1_OAEP_PADDING for enhanced security
- Automatic key file management

#### **Password Security**
- bcrypt hashing with configurable salt rounds
- Secure password comparison
- No plain text password storage

#### **JWT Token Management**
- Separate access and refresh tokens
- Configurable expiration times
- Token blacklisting for secure logout
- UUID-based token identification

### **Data Protection**
- Phone numbers encrypted before database storage
- Passwords hashed with bcrypt
- Sensitive fields excluded from responses
- OTP hashing for verification integrity

---

## 🏗 Architecture

### **Project Structure**
```
sarahaProject/
├── src/
│   ├── DB/
│   │   └── Models/
│   │       ├── user.model.js          # User schema with validations
│   │       ├── messages.model.js      # Message schema with relationships
│   │       ├── black-listed-tokens.model.js  # Token blacklist
│   │       └── db.connection.js       # MongoDB connection
│   ├── Modules/
│   │   ├── user/
│   │   │   ├── user.controller.js     # User route definitions
│   │   │   └── Services/
│   │   │       └── user.service.js    # User business logic
│   │   └── messages/
│   │       ├── messages.controller.js # Message route definitions
│   │       └── Services/
│   │           └── messages.service.js # Message business logic
│   ├── Middlewares/
│   │   └── authentication.middleware.js # JWT verification
│   └── Utils/
│       ├── encryption.utilis.js       # Encryption utilities
│       ├── tokens.utils.js           # JWT utilities
│       └── send-email.utils.js       # Email utilities
├── index.js                          # Application entry point
├── package.json                      # Dependencies and scripts
└── README.md                         # Project documentation
```

### **Database Schema**

#### **User Model**
```javascript
{
  firstName: String (required, lowercase, trimmed)
  lastName: String (required, lowercase, trimmed)
  age: Number (0-120, indexed)
  gender: String (enum: male/female)
  email: String (required, unique, lowercase)
  password: String (hashed, excluded from responses)
  phoneNumber: String (encrypted)
  otps: {
    confirmation: String (hashed)
    resetPassword: String (hashed)
  }
  isConfirmed: Boolean (default: false)
  timestamps: true (createdAt, updatedAt)
}
```

#### **Message Model**
```javascript
{
  content: String (required)
  receiverId: ObjectId (ref: User, required)
  timestamp: Date (default: Date.now)
}
```

### **Middleware Stack**
- **Express JSON Parser** - Request body parsing
- **Authentication Middleware** - JWT verification
- **Error Handling Middleware** - Global error management
- **CORS Support** - Cross-origin requests

---

## 🚦 Getting Started

### **Development Workflow**

1. **Start MongoDB** (if running locally)
2. **Configure environment variables**
3. **Run the application**: `npm start`
4. **Test endpoints** using Postman or similar tools

### **Testing the API**

1. **Register a new user** via `/users/add`
2. **Confirm email** with OTP via `/users/confirm`
3. **Sign in** to get access tokens via `/users/signIn`
4. **Send messages** using `/messages/sendMessage`
5. **Retrieve messages** via `/messages/getMessages`

---

<div align="center">

**Built with ❤️ using Node.js, Express, and MongoDB**

*Secure • Scalable • Anonymous*

</div>
