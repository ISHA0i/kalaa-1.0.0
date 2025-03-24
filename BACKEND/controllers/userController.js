const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments();

    // Execute query
    const users = await User.find()
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      totalPages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch users',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin) / Public profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If not admin and not the user, return only public fields
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      const publicUser = {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        bio: user.bio,
        isArtist: user.isArtist,
        role: user.role,
        createdAt: user.createdAt
      };
      
      return res.status(200).json({
        success: true,
        data: publicUser
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch user',
      error: error.message
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not create user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin, Self)
exports.updateUser = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // If user is updating themselves, they cannot change role
    if (req.user.role !== 'admin' && req.body.role) {
      delete req.body.role;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete user',
      error: error.message
    });
  }
};

// @desc    Get artists
// @route   GET /api/users/artists
// @access  Public
exports.getArtists = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments({ isArtist: true });

    // Execute query
    const artists = await User.find({ isArtist: true })
      .select('name profileImage bio createdAt')
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: artists.length,
      pagination,
      totalPages: Math.ceil(total / limit),
      data: artists
    });
  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch artists',
      error: error.message
    });
  }
};

// @desc    Get artist with products
// @route   GET /api/users/artists/:id
// @access  Public
exports.getArtistWithProducts = async (req, res) => {
  try {
    const artist = await User.findOne({ 
      _id: req.params.id, 
      isArtist: true 
    }).select('name profileImage bio createdAt');

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Get artist's products
    const products = await Product.find({ createdBy: req.params.id })
      .select('name price images category featured')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        artist,
        products
      }
    });
  } catch (error) {
    console.error('Get artist with products error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch artist with products',
      error: error.message
    });
  }
};

// @desc    Add product to user's favorites
// @route   POST /api/users/favorites/:productId
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in favorites
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    // Add to favorites
    user.favorites.push(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not add to favorites',
      error: error.message
    });
  }
};

// @desc    Remove product from user's favorites
// @route   DELETE /api/users/favorites/:productId
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if in favorites
    if (!user.favorites.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in favorites'
      });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not remove from favorites',
      error: error.message
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      select: 'name price images category'
    });

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not get favorites',
      error: error.message
    });
  }
}; 