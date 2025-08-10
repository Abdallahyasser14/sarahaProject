# 🚀 Complete Sarahah Project Tutorial
*A Step-by-Step Guide to Building a Node.js Backend with MongoDB*

## 📋 Table of Contents - Logical Project Building Order

### **Phase 1: Project Foundation**
1. [Project Overview & Planning](#project-overview--planning)
2. [Step 1: Initialize Project & Dependencies](#step-1-initialize-project--dependencies)
3. [Step 2: Set Up Database Connection](#step-2-set-up-database-connection)

### **Phase 2: Data Layer**
4. [Step 3: Create Encryption Utilities](#step-3-create-encryption-utilities)
5. [Step 4: Design User Model & Schema](#step-4-design-user-model--schema)
6. [Understanding: Validation vs Operations](#understanding-validation-vs-operations)
7. [Understanding: Index Strategies](#understanding-index-strategies)
8. [Understanding: Virtual Fields](#understanding-virtual-fields)

### **Phase 3: Business Logic**
9. [Step 5: Build User Services](#step-5-build-user-services)
10. [Understanding: Database Operations Masterclass](#understanding-database-operations-masterclass)
11. [Step 6: Create User Controllers & Routes](#step-6-create-user-controllers--routes)

### **Phase 4: Application Assembly**
12. [Step 7: Main Application Setup](#step-7-main-application-setup)
13. [Step 8: API Testing & Endpoints](#step-8-api-testing--endpoints)

### **Phase 5: Advanced Concepts**
14. [Project Structure Analysis](#project-structure-analysis)
15. [Security Best Practices](#security-best-practices)
16. [Next Steps & Improvements](#next-steps--improvements)

---

## 🎯 Project Overview & Planning

### **What We're Building**
We're creating a **Sarahah-like anonymous messaging backend** - a Node.js/Express API that handles user management with encrypted data storage. This tutorial follows the **exact order** you'd use to build this project from scratch.

### **What is Sarahah?**
Sarahah is an anonymous messaging platform where users can send and receive anonymous messages. Our backend provides the foundation with secure user management and encrypted data storage.

### **Learning Objectives**
By following this tutorial, you'll master:
- **Project initialization** and dependency management
- **Database connection** setup with MongoDB
- **Data encryption** for sensitive information
- **Schema design** with validation and indexing
- **Business logic** implementation with services
- **RESTful API** creation with Express
- **Security best practices** throughout

### **Technology Stack**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js v5.1.0** - Web application framework
- **MongoDB with Mongoose v8.16.4** - NoSQL database with ODM
- **Crypto (built-in Node.js module)** - For AES-256-CBC encryption

### **Project Architecture**
```
MVC Pattern:
📁 Models (Data Layer) → 🏗️ Services (Business Logic) → 🎮 Controllers (API Layer)
```

---

# Phase 1: Project Foundation

## 📦 Step 1: Initialize Project & Dependencies

### **1.1 Create Project Directory**
```bash
mkdir sarahaProject
cd sarahaProject
```

### **1.2 Initialize Node.js Project**
```bash
npm init -y
```

### **1.3 Install Dependencies**
```bash
npm install express@^5.1.0 mongoose@^8.16.4
```

### **1.4 Configure package.json**

```json
{
  "name": "sarahaproject",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "module",           // Enable ES6 modules
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^5.1.0",      // Web framework
    "mongoose": "^8.16.4"     // MongoDB ODM
  }
}
```

**🔑 Key Configuration:**
- `"type": "module"` enables ES6 import/export syntax
- Express v5.1.0 for modern web server features
- Mongoose for MongoDB object modeling

### **1.5 Create Directory Structure**
```bash
mkdir -p src/DB/Models
mkdir -p src/Modules/user/Services
mkdir -p src/Modules/messages
mkdir -p src/Utils
```

**Final Structure:**
```
sarahaProject/
├── index.js                    # Main entry point (we'll create this last)
├── package.json               # ✅ Created
├── src/
│   ├── DB/
│   │   └── Models/             # Database models
│   ├── Modules/
│   │   ├── user/               # User feature module
│   │   └── messages/           # Messages feature module
│   └── Utils/                  # Utility functions
```

---

## 🔌 Step 2: Set Up Database Connection

**Why Database First?** Before creating models or services, we need a working database connection. This follows the dependency hierarchy: Connection → Models → Services → Controllers.

### **2.1 Create Database Connection File**
Create `src/DB/Models/db.connection.js`:

### src/DB/Models/db.connection.js

```javascript
import mongoose from 'mongoose';

// how to connect to the database even if it didnt there it will create it for you when u make queries
// this is the connection to the database
const dbConnection = async () => {
try 
{
    // Connect to the MongoDB database in 30 seconds by default
    await mongoose.connect("mongodb://localhost:27017/sarahah_app",{serverSelectionTimeoutMS: 30000});
                                                                     // u can change it but the default is 30 seconds 
    
console.log('Database connected successfully');
}

catch (error)

{
    console.error('Error connecting to the database:', error);
    throw new Error('Database connection failed');
}
}

export default dbConnection;
```

### **2.2 Understanding Database Connection**

#### **Your Comment Analysis:**
> *"how to connect to the database even if it didnt there it will create it for you when u make queries"*

**This is a crucial MongoDB feature!** Unlike traditional SQL databases where you must explicitly create databases, MongoDB follows a **lazy creation pattern**:

- **Database Creation**: MongoDB creates the database only when you first write data to it
- **Collection Creation**: Collections (tables) are also created on first document insertion
- **No Pre-setup Required**: You don't need to run CREATE DATABASE commands

#### **Connection String Breakdown:**
```
mongodb://localhost:27017/sarahah_app
    │         │        │        │
    │         │        │        └── Database name (created on first write)
    │         │        └── Port number (MongoDB default)
    │         └── Host (local machine)
    └── Protocol (MongoDB connection protocol)
```

#### **Timeout Configuration Deep Dive:**
> *"u can change it but the default is 30 seconds"*

**Why 30 seconds?**
- **Network Latency**: Accounts for slow network connections
- **Server Startup**: MongoDB might be starting up
- **Connection Pool**: Time to establish connection pool
- **Production Consideration**: In production, you might want shorter timeouts (5-10 seconds)

**Alternative Timeout Configurations:**
```javascript
// For development (longer timeout)
serverSelectionTimeoutMS: 30000  // 30 seconds

// For production (shorter timeout)
serverSelectionTimeoutMS: 5000   // 5 seconds

// For local development (very short)
serverSelectionTimeoutMS: 2000   // 2 seconds
```

#### **Error Handling Strategy:**
- **Try-Catch**: Handles connection failures gracefully
- **Meaningful Messages**: Helps with debugging
- **Throw Error**: Prevents application from starting with bad DB connection
- **Console Logging**: Provides immediate feedback during development

---

# Phase 2: Data Layer

## 🔐 Step 3: Create Encryption Utilities

**Why Encryption First?** We'll need encryption for sensitive data (phone numbers) in our user model, so we create the utility functions first.

### **3.1 Create Encryption Utility File**
Create `src/Utils/encryption.utilis.js`:

### src/DB/Models/user.model.js

```javascript
/**
 * to build any model we build first the schema 
 * then we build the model from the schema
 * then we export the model and this is our collection
 * 
 */


import mongoose from 'mongoose';

// create the schema for the user
const userSchema = new mongoose.Schema({
firstName: {
    type: String,
    required: true,
    minLength: [2,"min length is 2"],  // built in validation with customize message with the error rahther than the default message
    maxLength: 50,
    lowercase: true, // convert to lowercase d2a mesh validator d2a operation abl el save
    trim: true // remove spaces from the start and end   bsrdo operation  d2a mesh validator it will not throw an error it makes operation only
},
lastName: {
    type: String,
    required: true,
    minLength: [2,"min length is 2"],
    maxLength: 50,
    lowercase: true,
    trim: true
},
age :


{
    type: Number,
    required: true,
    min: [0,"age must be greater than or equal to 0"],
    max: [120,"age must be less than or equal to 120"],
    index : true // create an index on the age field for faster queries bs howa haye3ml leih esm men nafso
// index on path level because we are creating an index on the age field we fi tari2a tanya we can create an index on the schema level nfs el haga 
    // index :{
    //     name: "age_index", // name of the index  keda law 3awez asmy el index
    // }
},
gender :
{
    type: String,
    enum :["male","female"],
    required: true,
    default:"male", // default value if the user didn't provide it
},
email: {
    type: String,
    required: true,
    unique: true, // unique index on the email field we heya bte3ml index automatically we heya bte3ml esm lei law 3awez te3ml name enta e3mlo bel tari2a ely fo2
    lowercase: true, // convert to lowercase
    trim: true, // remove spaces from the start and end
    
},
password: {
    type: String,
    required: true,
    minLength: [6,"min length is 6"],
    maxLength: 50,
    select: false ,// this field will not be returned in the response by default,
    set (value)
    {
        // this is a setter function it will be called when the user saves the password
        // we can use it to hash the password before saving it to the database
        // we can use bcrypt or any other library to hash the password
        // for now we will just return the value as it is
        return value;
    }
},
phoneNumber: {
    type: String,
    required: true,
  //  unique: true, // unique index on the phoneNumber field
    trim: true, // remove spaces from the start and end
    set(value) {
        // this is a setter function it will be called when the user saves the phone number
        // we can use it to encrypt the phone number before saving it to the database
        return value; // for now we will just return the value as it is
    }

}
}
    // {} el object el tany el options b2a w keda 
    ,
    {

        toJSON:
        {
            virtuals: true, // this will include the virtual fields in the response when we call toJSON on the model instance
         
        },
        timestamps: true, // this will add createdAt and updatedAt fields to the schema automatically
        // law 3awez a3ml virtual columns we can do it here
        // virtuals: true, // this will add virtual fields to the schema automatically that will not be saved to the database and be calculated on the fly like first name and last name = name
        virtuals : // betigy wa2t el response ya3ni men 8ir ma tetlob mesh zy el models 

        {
            fullName:
            {
                get() { // this is a getter function it will be called when the user accesses the fullName field
                    // we can use it to return the full name of the user
                    // d2a mesh 3awez a3ml set function because we don't need to set the full name we just need to get it
                    return `${this.firstName} ${this.lastName}`;
                }
            }
        }, // el virtuals msh hateshtagal 8ir lazem te3ml toObject aw toJSON method in the model to include the virtuals in the response mesh hatet3mal by default  

        
        methods: { // this is an object that will contain the methods of the model
            // we can add custom methods to the model here
            // these methods will be available on the instances of the model b3d ma te3ml el schema we menha tcreate el model
            // we dol hatlai2hom m3 el default model and this make it easy to use in the apis
            getFullName() {
                return `${this.firstName} ${this.lastName}`;
            }
        }
    }  




);

// compund index on firstName and lastName schema level
userSchema.index({firstName: 1, lastName: 1}, {unique: true}); // create a unique index on the firstName and lastName fields
// this will make sure that the combination of firstName and lastName is unique in the database


/* * 
 * el model haib2a gowaa default methods zy create, find, findById, findOne, update, delete,save, etc.
* u can add custom methods fel object beta3 el objects mehods ;{
    customMethod() {
         custom method logic
    }
 * 
    we can use them when we create a user per exmple
 */



    // create the model from the schema
const User = mongoose.model('User', userSchema); // User is the name of the collection in the database
// that will be used in the APIS

export default User; // export the model so we can use it in the controllers and services
// we can use this model to create, read, update and delete users in the database
```

---

## 👤 Step 4: Design User Model & Schema

**Why After Encryption?** Now that we have encryption utilities, we can create the user model that uses them for sensitive data.

### **4.1 Create User Model File**
Create `src/DB/Models/user.model.js`:

### **Your Critical Comment Analysis:**
> *"convert to lowercase d2a mesh validator d2a operation abl el save"*
> *"remove spaces from the start and end bsrdo operation d2a mesh validator it will not throw an error it makes operation only"*

**This is a FUNDAMENTAL concept in Mongoose!** You've identified the key difference between **validators** and **operations**:

#### **🚨 Validators (Will Throw Errors)**
```javascript
required: true,           // ❌ Throws error if missing
minLength: [2, "error"],  // ❌ Throws error if too short
max: [120, "error"],      // ❌ Throws error if too large
enum: ["male", "female"] // ❌ Throws error if not in list
```

#### **⚙️ Operations (Transform Data Silently)**
```javascript
lowercase: true,  // ✅ Converts "JOHN" → "john" (no error)
trim: true,       // ✅ Converts " john " → "john" (no error)
default: "male"   // ✅ Sets value if not provided (no error)
```

### **Why This Matters:**
- **Validators**: Stop the save process if data is invalid
- **Operations**: Clean and transform data before saving
- **Order**: Operations run BEFORE validators
- **Error Handling**: Only validators can cause save failures

### **Real-World Example:**
```javascript
// Input: "  JOHN  "
// 1. trim: true → "JOHN" (operation)
// 2. lowercase: true → "john" (operation) 
// 3. minLength: [2, "error"] → ✅ passes (validator)
// Final result: "john"
```

---

## 🔍 Understanding: Validation vs Operations

### **Your Index Comments Deep Dive:**
> *"create an index on the age field for faster queries bs howa haye3ml leih esm men nafso"*
> *"index on path level because we are creating an index on the age field we fi tari2a tanya we can create an index on the schema level nfs el haga"*

#### **🎯 Path Level vs Schema Level Indexing**

**Path Level (What you used):**
```javascript
age: {
    index: true  // MongoDB auto-generates index name
}
```

**Schema Level (Alternative approach):**
```javascript
// After schema definition
userSchema.index({ age: 1 }, { name: "custom_age_index" });
```

#### **Index Naming Strategy:**
> *"bs howa haye3ml leih esm men nafso"* (it will create a name by itself)

**Auto-generated names** follow pattern: `fieldName_1` or `fieldName_-1`
- `age_1` for ascending index
- `age_-1` for descending index

**Custom naming** gives you control:
```javascript
index: {
    name: "age_index"  // Your custom name
}
```

#### **Compound Index Explanation:**
> *"create a unique index on the firstName and lastName fields"*

```javascript
userSchema.index({firstName: 1, lastName: 1}, {unique: true});
```

**This means:**
- ✅ Allowed: {firstName: "john", lastName: "doe"}
- ✅ Allowed: {firstName: "jane", lastName: "doe"}
- ❌ Blocked: Another {firstName: "john", lastName: "doe"}

#### **Index Performance Impact:**
- **Query Speed**: Indexes make searches faster
- **Write Speed**: Indexes slow down inserts/updates
- **Storage**: Indexes take additional disk space
- **Memory**: Indexes are loaded into RAM

---

## 📊 Understanding: Index Strategies

### **Your Virtual Comments Analysis:**
> *"betigy wa2t el response ya3ni men 8ir ma tetlob mesh zy el models"*
> *"el virtuals msh hateshtagal 8ir lazem te3ml toObject aw toJSON method"*

#### **Virtual Fields Behavior:**

**When Virtuals Appear:**
- ✅ In JSON responses (when `toJSON: { virtuals: true }`)
- ✅ When explicitly calling `.toObject({ virtuals: true })`
- ❌ NOT in database queries by default
- ❌ NOT in `.find()` results unless configured

**Example:**
```javascript
const user = await User.findById(userId);
console.log(user.fullName);        // ✅ Works (getter function)
console.log(user.toJSON());        // ✅ Includes fullName
console.log(user.toObject());      // ❌ Might not include fullName
```

#### **Virtual vs Methods:**
```javascript
// Virtual (property-like access)
virtuals: {
    fullName: {
        get() { return `${this.firstName} ${this.lastName}`; }
    }
}

// Method (function call)
methods: {
    getFullName() { return `${this.firstName} ${this.lastName}`; }
}

// Usage:
user.fullName      // Virtual (no parentheses)
user.getFullName() // Method (with parentheses)
```

---

## 🎭 Understanding: Virtual Fields

### **Your Virtual Comments Analysis:**
> *"betigy wa2t el response ya3ni men 8ir ma tetlob mesh zy el models"*
> *"el virtuals msh hateshtagal 8ir lazem te3ml toObject aw toJSON method"*

#### **Virtual Fields Behavior:**

**When Virtuals Appear:**
- ✅ In JSON responses (when `toJSON: { virtuals: true }`)
- ✅ When explicitly calling `.toObject({ virtuals: true })`
- ❌ NOT in database queries by default
- ❌ NOT in `.find()` results unless configured

**Example:**
```javascript
const user = await User.findById(userId);
console.log(user.fullName);        // ✅ Works (getter function)
console.log(user.toJSON());        // ✅ Includes fullName
console.log(user.toObject());      // ❌ Might not include fullName
```

#### **Virtual vs Methods:**
```javascript
// Virtual (property-like access)
virtuals: {
    fullName: {
        get() { return `${this.firstName} ${this.lastName}`; }
    }
}

// Method (function call)
methods: {
    getFullName() { return `${this.firstName} ${this.lastName}`; }
}

// Usage:
user.fullName      // Virtual (no parentheses)
user.getFullName() // Method (with parentheses)
```

---

# Phase 3: Business Logic

## 🏗️ Step 5: Build User Services

**Why Services Before Controllers?** Services contain business logic and database operations. Controllers just handle HTTP requests and call services.

### **5.1 Create User Service File**
Create `src/Modules/user/Services/user.service.js`:

---

**Key Features Explained:**

#### 🔍 **Field Validation**
- **Built-in Validators**: `required`, `minLength`, `maxLength`, `min`, `max`
- **Custom Error Messages**: `[2, "min length is 2"]`
- **Enum Validation**: `enum: ["male", "female"]`

#### 🔧 **Data Transformation**
- **lowercase**: Converts to lowercase before saving
- **trim**: Removes leading/trailing spaces
- **set()**: Custom setter functions for data processing

#### 📊 **Database Optimization**
- **Single Field Index**: `index: true` on age
- **Unique Index**: `unique: true` on email
- **Compound Index**: `{firstName: 1, lastName: 1}` for unique combinations

#### 🎭 **Virtual Fields**
- **fullName**: Computed field combining firstName + lastName
- **Not Stored**: Virtual fields don't take database space
- **Included in JSON**: When `virtuals: true` is set

#### 🛡️ **Security Features**
- **select: false**: Password hidden by default in queries
- **Setter Functions**: Prepare for encryption/hashing

### **3.2 Encryption Implementation**

```javascript
import crypto from 'crypto';
import { buffer, text } from 'stream/consumers';

const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY = Buffer.from('12345678901234567890123456789012'); 
// This is a secret key that will be used to encrypt and decrypt the data
// Buffer.from returns binary and it is a must for the crypto function
// IN SYMMETRIC ENCRYPTION WE USE THE SAME KEY TO ENCRYPT AND DECRYPT THE DATA

export const encryptData = (data) => {
    // Step 1: Generate random IV (Initialization Vector)
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Step 2: Create cipher using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);

    // IV is the initialization vector that is used to make the encryption more secure
    // Without it, the same data will always produce the same encrypted output so it could be easily decrypted
    // The IV is a random value that makes the encryption more secure
    // It won't affect the decryption process because we will use the same IV to decrypt the data
    // We don't encrypt the IV, we just start the encryption process with it
    // It's not like IV + encryption of the text because then the attacker will ignore the IV and see patterns
    // In encryption, each block of ciphertext depends on the previous block, and each block affects the next
    // So the first block becomes random and the following blocks will be different
    // IV is not encrypted, we just encrypt with it

    // WITH STEPS 1 AND 2 WE JUST MAKE THE FIRST STEP "create cipher" - WE HAVEN'T DONE ENCRYPTION YET

    // Step 3: Update - this is what produces the encryption
    let encryptedData = cipher.update(data, 'utf-8', 'hex');

    // Step 4: Final - this ends the encryption process
    encryptedData += cipher.final('hex');
    // The final method handles the end of the encryption process and also handles any remaining block
    // It works 16 by 16, so if there's remaining data, final handles it
    // It processes only completed blocks, final handles the last chunk
    // It does padding to make it divisible by 16
    // Returns last chunk that's not completed and not processed by update
    // So we add what comes from final to the updated data

    // Return format: "IV_in_hex : encrypted_data_in_hex"
    return `${iv.toString('hex')}:${encryptedData}`;
    // We need the IV in decryption, so we must store or save the encrypted data with the IV
    // IV can be not secured normally
};

// TO MAKE ENCRYPTION WE DIVIDE THE CIPHER INTO BLOCKS OR PARTS 
/**
 * create cipher => this is the first part of the encryption process
 * => takes the data and the secret key and returns an encrypted string and the algorithm used to encrypt the data
 * update cipher => make encryption on the data
 * final cipher => combination of the three
 */

export const decrypt = (encryptedString) => {
    // Split the encrypted string to get IV and encrypted data
    const [ivHex, encryptedHex] = encryptedString.split(':');

    // Convert IV back to buffer
    const iv = Buffer.from(ivHex.trim(), 'hex');
    const encrypted = encryptedHex.trim();

    // Create decipher with the same algorithm, key, and IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
};
```

**Encryption Process Explained:**

#### 🔑 **AES-256-CBC Algorithm**
- **AES**: Advanced Encryption Standard
- **256**: Key size in bits (very secure)
- **CBC**: Cipher Block Chaining mode

#### 🎲 **Initialization Vector (IV)**
- **Random 16 bytes** for each encryption
- **Prevents pattern recognition** in encrypted data
- **Stored with encrypted data** for decryption
- **Not secret** but essential for security

#### 🔄 **Encryption Steps**
1. **Generate random IV**
2. **Create cipher** with algorithm + key + IV
3. **Update cipher** with actual data
4. **Finalize** to handle remaining blocks and padding

---

## 🎛️ User Services & Controllers

### src/Modules/user/user.controller.js

```javascript
import {Router} from 'express';
import * as userService from './Services/user.service.js'; // Assuming addUser is defined in user.service.js
const userRouter = Router();

userRouter.post('/add', userService.addUser); // Route to add a new user
userRouter.put('/update/:userId', userService.UpdateService); // Route to update an existing user by ID
userRouter.delete('/delete/:userId', userService.DeleteService); // Route to delete a user by ID
userRouter.get('/list', userService.ListUsers);

// We will encrypt the phone number when the user sign up and decrypt it when the user retrieve or view their profile 

export default userRouter;
```

### src/Modules/user/Services/user.service.js

```javascript
import User from "../../../DB/Models/user.model.js";
import { decrypt, encryptData } from "../../../Utils/encryption.utilis.js";

export const addUser = async (req, res) => {
    try {
        const { firstName, lastName, age, email, password, gender, phoneNumber } = req.body;
        // Validate the input data

        // We must find the user by email to check if the user already exists before creating
        // This way the error comes from us, not from the database

        /**
         * To find a user by email:
         * find => to find all documents that match the query. Returns an array of documents if found or empty array if not found
         * findOne => to find one document only. Returns a single document or null if not found
         * findById => to find by id (_id only). One condition is the id - the fastest. Returns a single document or null if not found
         */

        // We have another unique condition on firstName and lastName so we will check the email or the combination of firstName and lastName
        // If any of them exists => error
        const isEmailExists = await User.findOne({ 
            $or: [
                { email: email }, 
                { firstName: firstName, lastName: lastName } // AND condition
            ]
        });

        if (isEmailExists) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // If it passes the check, add user to the database 
        /**
         * create => to create a new document in the database
         * save => to save the document to the database 
         * To work with save, you need something returned from the database. You have 2 ways:
         * 1- Create instance of the model and then call the save method on it 
         *    => const userInstance = new User({ firstName, lastName, age, email, password, gender });
         *    This creates an instance of the model in code but still needs to be saved to the database
         *    => await userInstance.save();
         * 2- Find the document and then call the save method on it
         * insertMany => to insert multiple documents at once (bulk insert array of documents)
         */

        // Session 10 week 2:
        // We will encrypt the phone number when the user sign up and decrypt it when the user retrieve or view their profile
        // Here we will encrypt the phone number before saving it to the database
        // We can encrypt anything so it is a common function, so we can create a utility function to encrypt and decrypt the phone number
        // Use utilities files

        const encryptPhoneNumber = encryptData(phoneNumber);
        console.log("Encrypted phone number: ", encryptPhoneNumber);

        const user = await User.create({
            firstName,
            lastName,
            age,
            email,  
            password,
            gender,
            phoneNumber: encryptPhoneNumber
        });

        return res.status(201).json({
            message: 'User added successfully',
            user
        });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches (assuming you have a method to compare passwords)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If everything is fine, return the user data (excluding password)
        const { password: _, ...userData } = user.toObject();
        
        return res.status(200).json({
            message: 'User signed in successfully',
            user: userData
        });
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * To update the user:
 * save => find first then update the fields and then save the document
 * updateOne => to update one document in the database                 
 * updateMany => to update multiple documents at once (bulk update)
 * Both updateOne and updateMany return object with the number of documents that were updated (modifiedCount)
 * So we can use it to check if the update was successful or not
 * findByIdAndUpdate => to find a document by id and update it
 * findOneAndUpdate => to find one document that matches the query and update it
 */
export const UpdateService = async (req, res) => {  
    // Updates user any field except password because it is sensitive data and has different logic
    try {
        const { userId } = req.params; // Assuming userId is passed as a URL parameter
        const { firstName, lastName, age, email, gender } = req.body;
        
        const user = await User.findById(userId); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        /* SAVE METHOD
        // Update the user fields with save method
        user.firstName = firstName || user.firstName; // Update only if provided
        user.lastName = lastName || user.lastName;
        user.age = age || user.age;
        
        if (email) {
            // Check if the new email already exists
            const isEmailExists = await User.findOne({email});
            if (isEmailExists && isEmailExists._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            user.email = email; // Update email only if it doesn't exist
        } 
        user.gender = gender || user.gender;

        await user.save(); // Save the updated user
        return res.status(200).json({
            message: 'User updated successfully',
            user
        });
        */

        /*
        UPDATE ONE METHOD
        // Update the user fields with updateOne method
        const updatedUser = await User.updateOne(
            { _id: userId }, // Find the user by ID
            { // Second object for the fields to set
                $set: { // You can use without $set normally
                    firstName: firstName || user.firstName,
                    lastName: lastName || user.lastName,
                    age: age || user.age,
                    email: email || user.email, // Update email only if provided
                }
            }
        );

        if (updatedUser.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to the user' });
        }
        return res.status(200).json({
            message: 'User updated successfully',
            user: { ...user.toObject(), ...{ firstName, lastName, age, email } } // Return updated user data
        });
        */

        // FINDBYIDANDUPDATE METHOD
        // Update the user fields with findByIdAndUpdate method
        const updatedUser = await User.findByIdAndUpdate(
            userId, // Find the user by ID
            { // Update fields - the object for the fields to update
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                age: age || user.age,
                email: email || user.email, // Update email only if provided
            },
            {
                new: true, // Return the updated user data - necessary to return this in the updated user
                runValidators: true // Run validation on the updated fields
            }
        );

        // It returns by default the old user data so we need to set the option to return the new user data 
        // It returns null if the user is not found

        res.status(200).json({
            message: 'User updated successfully',
            user: { ...user.toObject(), ...{ firstName, lastName, age, email } } // Return updated user data
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Hard delete user
/**
 * deleteOne => to delete one document only with condition in the database returns the number of documents deleted
 * deleteMany => to delete multiple documents at once (bulk delete) returns the number of documents deleted
 * findByIdAndDelete => to find a document by id and delete it and return it returns the deleted document
 * findOneAndDelete => to find one document that matches the query and delete it and return it 
 */
export const DeleteService = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming userId is passed as a URL parameter

        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return a success message
        res.status(200).json({
            message: 'User deleted successfully',
            user: deletedUser // Return the deleted user data
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const ListUsers = async (req, res) => {
    let users = await User.find();
    users = users.map((user) => {
        return {
            ...user._doc,
            phoneNumber: decrypt(user.phoneNumber) // Decrypt phone number for display
        }
    });
    res.status(200).json({ users });
}
```

**Service Methods Explained:**

#### ➕ **addUser**
- **Validation**: Check for existing email/name combination
- **Encryption**: Encrypt phone number before saving
- **Error Handling**: Comprehensive try-catch blocks

#### 🔄 **UpdateService**
- **Three Methods Shown**: save(), updateOne(), findByIdAndUpdate()
- **Conditional Updates**: Only update provided fields
- **Validation**: Run validators on updated fields

#### ❌ **DeleteService**
- **Hard Delete**: Permanently removes user
- **Return Deleted Data**: Useful for confirmation

#### 📋 **ListUsers**
- **Decryption**: Decrypt phone numbers for display
- **Data Mapping**: Transform encrypted data for response

---

## 🌐 Main Application Entry Point

### index.js

```javascript
import express from 'express';
import dbConnection from './src/DB/Models/db.connection.js';
import userRouter from './src/Modules/user/user.controller.js';
import messageRouter from './src/Modules/messages/messages.controller.js';

const app = express();

// Connect to the database - it will retry to connect if it fails until it times out
// If the database is not running it will throw an error after 30 seconds
dbConnection();

app.use(express.json());
app.use("/users", userRouter);
app.use("/messages", messageRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

**Application Flow:**
1. **Import Dependencies**: Express, database connection, routers
2. **Database Connection**: Establish MongoDB connection
3. **Middleware Setup**: JSON parsing
4. **Route Registration**: User and message routes
5. **Server Start**: Listen on port 3000

---

## 🔗 API Endpoints

### User Endpoints

| Method | Endpoint | Description | Body Parameters |
|--------|----------|-------------|-----------------|
| POST | `/users/add` | Create new user | firstName, lastName, age, email, password, gender, phoneNumber |
| PUT | `/users/update/:userId` | Update user | firstName, lastName, age, email, gender |
| DELETE | `/users/delete/:userId` | Delete user | - |
| GET | `/users/list` | List all users | - |

### Example API Calls

#### Create User
```bash
POST http://localhost:3000/users/add
Content-Type: application/json

{
  "firstName": "john",
  "lastName": "doe",
  "age": 25,
  "email": "john.doe@example.com",
  "password": "123456",
  "gender": "male",
  "phoneNumber": "1234567890"
}
```

#### Update User
```bash
PUT http://localhost:3000/users/update/USER_ID
Content-Type: application/json

{
  "firstName": "jane",
  "age": 26
}
```

---

## 🎓 Key Learning Points

### 1. **MongoDB Schema Design**
- **Validation Rules**: Built-in and custom validators
- **Indexes**: Single field, unique, and compound indexes
- **Virtual Fields**: Computed properties not stored in DB
- **Middleware**: Pre/post hooks for data processing

### 2. **Security Best Practices**
- **Data Encryption**: Symmetric encryption for sensitive data
- **Field Selection**: Hide sensitive fields by default
- **Input Validation**: Comprehensive validation at multiple levels

### 3. **API Design Patterns**
- **RESTful Routes**: Standard HTTP methods and status codes
- **Error Handling**: Consistent error responses
- **Data Transformation**: Encrypt on save, decrypt on retrieve

### 4. **Code Organization**
- **MVC Pattern**: Separation of concerns
- **Modular Structure**: Feature-based organization
- **Utility Functions**: Reusable encryption/decryption

### 5. **Database Operations**
- **CRUD Operations**: Create, Read, Update, Delete
- **Query Methods**: find(), findOne(), findById()
- **Update Strategies**: save(), updateOne(), findByIdAndUpdate()

---

## 🚀 Next Steps

1. **Implement Messages Module**: Complete the messaging functionality
2. **Add Authentication**: JWT tokens for secure API access
3. **Password Hashing**: Implement bcrypt for password security
4. **Input Validation**: Add middleware for request validation
5. **Error Middleware**: Centralized error handling
6. **Testing**: Unit and integration tests
7. **Documentation**: API documentation with Swagger

---

## 📝 Summary

This Sarahah project demonstrates a well-structured Node.js backend with:
- **Robust data modeling** with Mongoose
- **Security-first approach** with encryption
- **Clean architecture** following MVC patterns
- **Comprehensive validation** and error handling
- **RESTful API design** with proper HTTP status codes

The codebase serves as an excellent foundation for building scalable web applications with modern JavaScript and MongoDB.
