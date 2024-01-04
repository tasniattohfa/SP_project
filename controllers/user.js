const User = require('../model/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate that required fields are provided
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required fields.' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Creating a new user instance with the hashed password
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      const savedUser = await user.save();
  
      console.log('User inserted successfully:', savedUser);
  
      // Respond with the saved user details
      res.status(201).json(savedUser);
    } catch (error) {
      console.error('Error inserting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
  
      // Respond with the token
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
exports.authenticateToken = async (req, res, next) => {
    try {
      // Get the token from the Authorization header
      const token = req.header('Authorization').split(' ')[1];
  
      // Verify the token
      const decodedToken = jwt.verify(token, 'your_secret_key');
  
      // Attach the decoded user ID to the request object
      req.userId = decodedToken.userId;
  
      // Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error authenticating token:', error.message);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  exports.fetchUser = async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
  
      // finding the user by email
      const user = await User.findOne({ email: userEmail });
  
      // checking if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // respond with the user details
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
  
      // Find the user by email
      const user = await User.findOne({ email: userEmail });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Verify the provided password
      const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect current password.' });
      }
  
      // Update user properties
      if (req.body.newUsername) {
        user.username = req.body.newUsername;
      }
      if (req.body.newPassword) {
        // Hash the updated password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
        user.password = hashedPassword;
      }
  
      // Save the updated user to the database
      const updatedUser = await user.save();
  
      // Respond with the updated user details
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  exports.deleteUser =  async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // validating that the userId is a valid ObjectId
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid userId format.' });
      }
  
      // finding the user by ID and delete it
      const deletedUser = await User.findByIdAndDelete(userId);
  
      // checking if the user exists
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // respond with a success message
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };