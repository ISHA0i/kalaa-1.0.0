# Connection Refused Error Troubleshooting Guide

## Error Description
The error `ERR_CONNECTION_REFUSED` when accessing `http://localhost:5001/api/products` indicates that the backend server is not responding.

## Common Causes and Solutions

1. **MongoDB Not Running**
   - Ensure MongoDB is installed and running locally
   - Start MongoDB service:
     ```bash
     # Windows
     net start MongoDB
     
     # Linux/Mac
     sudo service mongod start
     # or
     brew services start mongodb-community
     ```

2. **Backend Server Not Started**
   - Navigate to the BACKEND directory
   - Start the server:
     ```bash
     cd BACKEND
     npm install
     npm start
     ```
   - You should see "Server is running on port 5001" in the console

3. **Port Conflicts**
   - Ensure nothing else is using port 5001
   - Check if the port is in use:
     ```bash
     # Windows
     netstat -ano | findstr :5001
     
     # Linux/Mac
     lsof -i :5001
     ```

4. **Environment Variables**
   - Verify .env files exist in both FRONTEND and BACKEND directories
   - Backend .env should have:
     ```
     PORT=5001
     MONGODB_URI=mongodb://localhost:27017/kalaa
     ```

5. **Starting Both Services**
   - Use the provided npm script from the FRONTEND directory:
     ```bash
     cd FRONTEND
     npm run both
     ```

## Additional Steps
1. Check MongoDB connection by running `mongo` in terminal
2. Verify the backend is running by visiting http://localhost:5001
3. Check console logs for specific error messages
4. Ensure all dependencies are installed in both directories

If problems persist, verify your MongoDB installation and check system logs for more detailed error messages.