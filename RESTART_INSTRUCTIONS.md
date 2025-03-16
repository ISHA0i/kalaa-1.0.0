# Important: Services Restart Required



1. Stop both the frontend and backend services if they are running
2. Start the backend server first:
   ```
   cd BACKEND
   npm start
   ```
   Verify you see "Server is running on port 5001" in the console

3. Start the frontend service in a new terminal:
   ```
   cd FRONTEND
   npm start
   ```



## Verification
- Backend API should be accessible at http://localhost:5001/api/products
- Frontend should successfully fetch and display products