const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getArtists,
  getArtistWithProducts,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/artists', getArtists);
router.get('/artists/:id', getArtistWithProducts);

// Protected routes
router.get('/favorites', verifyToken, getFavorites);
router.post('/favorites/:productId', verifyToken, addFavorite);
router.delete('/favorites/:productId', verifyToken, removeFavorite);

// Admin routes
router.route('/')
  .get(verifyToken, authorize('admin'), getUsers)
  .post(verifyToken, authorize('admin'), createUser);

router.route('/:id')
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, authorize('admin'), deleteUser);

module.exports = router;