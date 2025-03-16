# Setup Instructions

## Prerequisites
1. Install Node.js and npm
2. Install MongoDB Community Edition:
   - Windows: Download and install from [MongoDB website](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [MongoDB installation guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

## Database Setup
1. Start MongoDB service:
   ```bash
   # Windows (run as administrator)
   net start MongoDB

   # Mac
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongosh
   ```

## Backend Setup
1. Navigate to BACKEND directory:
   ```bash
   cd BACKEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify .env file exists with:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup
1. Open a new terminal
2. Navigate to FRONTEND directory:
   ```bash
   cd FRONTEND
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the frontend:
   ```bash
   npm start
   ```

## Troubleshooting
If you see `ERR_CONNECTION_REFUSED`:

1. Check if MongoDB is running:
   ```bash
   mongosh
   ```
   If it fails, start MongoDB as shown in Database Setup section.

2. Verify backend is running:
   - Check if "Server is running on port 5001" message appears
   - Check if "MongoDB connected successfully" message appears

3. Common issues:
   - MongoDB not running (most common cause)
   - Port 5001 already in use
   - Missing dependencies (run npm install in both directories)
   - Wrong MongoDB connection string in .env