# Solution for Connection Refused Error

## Problem
Unable to connect to `http://localhost:5001/api/products` with connection refused error.

## Diagnosis
The server code is correctly configured:
- Port is set to 5001
- MongoDB connection is properly configured
- Server initialization code is present

The connection refused error typically indicates that the server process is not running or cannot start, often due to MongoDB connection issues.

## Solution Steps

1. **Ensure MongoDB is Running**
   ```bash
   # On Windows
   net start MongoDB
   # Or check MongoDB service in Services.msc
   
   # On Linux/Mac
   sudo systemctl start mongodb
   # Or
   mongod
   ```

2. **Verify MongoDB Connection**
   ```bash
   # Test MongoDB connection
   mongo
   # Or for newer versions
   mongosh
   ```

3. **Start the Backend Server**
   ```bash
   cd BACKEND
   npm install
   npm start
   ```

4. **Verify Server is Running**
   - Check terminal output for successful MongoDB connection message
   - Look for "Server is running on port 5001" message
   - If errors occur, they will be logged in the console

5. **Test the Connection**
   ```bash
   curl http://localhost:5001/api/products
   ```

## Common Issues and Solutions

1. If MongoDB fails to connect:
   - Verify MongoDB is installed properly
   - Check if MongoDB service is running
   - Ensure no firewall is blocking port 27017

2. If server fails to start:
   - Check if another process is using port 5001
   - Ensure all dependencies are installed (run `npm install`)
   - Check environment variables if using custom MongoDB URI

3. If connection is still refused:
   - Try stopping and restarting the MongoDB service
   - Restart the Node.js server
   - Check system logs for any related errors

## Need Further Help?
- Check MongoDB logs for detailed error messages
- Ensure all necessary environment variables are set
- Review the CONNECTION_TROUBLESHOOTING.md file for additional debugging steps