const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price image description'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: `No product found with id ${productId}`
      });
    }

    // Find user's cart or create one
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if product is already in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    // If product exists in cart, update quantity
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity: quantity || 1
      });
    }

    await cart.save();

    // Fetch the cart with populated product details
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image description'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.itemId; 

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Update item quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Return updated cart
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image description'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Update Cart Item Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    // Return updated cart
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image description'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Remove From Cart Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};