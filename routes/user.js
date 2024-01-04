const express = require('express');
const router = express.Router();

const {
    createUser,
    fetchUser,
    updateUser,
    deleteUser,
    loginUser,
    authenticateToken
} = require('../controllers/user');

const User = require('../model/user');
// route to handle user creation
router.post('/users/register', createUser)

// route to handle user login
router.post('/users/login', loginUser);

router.get('/protected-route', authenticateToken, (req, res) => {
    // Access the authenticated user ID using req.userId
    const userId = req.userId;
    res.json({ message: 'Access granted!', userId });
  });

// route to handle fetching a user by email
router.get('/users/fetch/email/:userEmail', fetchUser);

// route to handle updating a user by email
router.put('/users/update/email/:userEmail', updateUser);

// route to handle deleting a user by ID
router.delete('/users/delete/:userId', deleteUser);

module.exports = router;
