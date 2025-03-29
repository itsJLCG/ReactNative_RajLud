const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No order items provided'
      });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      // If payment method is Cash on Delivery, paymentResult will be added later
    });

    // Handle immediate payment methods
    if (paymentMethod !== 'Cash on Delivery') {
      // In a real app, you would process payment with a payment gateway here
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: 'SIMULATED_PAYMENT_ID',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };
    }

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    // If user is admin, get all orders, otherwise get only user's orders
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Make sure user is admin or the order belongs to user
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Update status
    order.status = status;
    
    // Update tracking number if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    // Update delivery status
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update payment status (for manual updates)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { isPaid, paymentResult } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Update payment status
    order.isPaid = isPaid;
    
    if (isPaid) {
      order.paidAt = Date.now();
      
      if (paymentResult) {
        order.paymentResult = paymentResult;
      } else {
        order.paymentResult = {
          id: `MANUAL-${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: 'manual@update.com'
        };
      }
    } else {
      order.paidAt = null;
      order.paymentResult = {};
    }
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update Payment Status Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Check if user is admin or order belongs to user
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }
    
    // Check if order can be cancelled (only if not delivered)
    if (order.isDelivered) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel an order that has been delivered'
      });
    }
    
    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};