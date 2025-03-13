import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../actions/cartActions';
import { placeOrder } from '../actions/orderActions';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { loading } = useSelector(state => state.orders);
  const [isProcessing, setIsProcessing] = useState(false);
 
  // Default shipping address - in a real app, this would come from user's saved addresses
  const [selectedAddress] = useState({
    name: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  });
  
  // Default payment method - in a real app, this would come from user's saved payment methods
  const [selectedPaymentMethod] = useState({
    type: 'Credit Card',
    lastFour: '4242',
    icon: 'card-outline'
  });
  
  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;
  
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    // Create order object with all the order details
    const orderData = {
      items: cartItems,
      shippingAddress: selectedAddress,
      paymentMethod: selectedPaymentMethod.type,
      subtotal: subtotal,
      shippingCost: shipping,
      tax: tax,
      total: total,
      trackingNumber: 'Pending'
    };
    
    const result = await dispatch(placeOrder(orderData));
    
    setIsProcessing(false);
    
    if (result.success) {
      // Clear the cart
      dispatch(clearCart());
      
      // Show success message and navigate to MyOrders screen through the ProfileTab
      Alert.alert(
        'Success',
        'Your order has been placed successfully!',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('ProfileTab', {
            screen: 'MyOrders',
          })
        }]
      );
    } else {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholderButton} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => Alert.alert('Coming Soon', 'Address management will be available soon!')}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressName}>{selectedAddress.name}</Text>
            <Text style={styles.addressLine}>{selectedAddress.street}</Text>
            <Text style={styles.addressLine}>
              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
            </Text>
            <Text style={styles.addressLine}>{selectedAddress.country}</Text>
          </View>
        </View>
        
        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => Alert.alert('Coming Soon', 'Payment method management will be available soon!')}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentContainer}>
            <View style={styles.paymentMethod}>
              <Ionicons name={selectedPaymentMethod.icon} size={24} color="#1E3A8A" style={styles.paymentIcon} />
              <Text style={styles.paymentText}>
                {selectedPaymentMethod.type} •••• {selectedPaymentMethod.lastFour}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Order Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>
          
          {/* Items */}
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          {/* Price Breakdown */}
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax</Text>
              <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        {/* Estimated Delivery */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Estimated Delivery</Text>
          </View>
          <Text style={styles.deliveryDate}>
            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', 
              { weekday: 'long', month: 'long', day: 'numeric' }
            )}
          </Text>
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, (isProcessing || loading) && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isProcessing || loading || cartItems.length === 0}
        >
          {isProcessing || loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order • ${total.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  backButton: {
    padding: 4,
  },
  placeholderButton: {
    width: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  changeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeButtonText: {
    color: '#1E3A8A',
    fontWeight: '500',
  },
  addressContainer: {
    marginBottom: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  addressLine: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 3,
  },
  paymentContainer: {
    marginBottom: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentText: {
    fontSize: 15,
    color: '#1F2937',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 70,
    height: 70,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    resizeMode: 'contain',
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  priceBreakdown: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  deliveryDate: {
    fontSize: 15,
    color: '#1F2937',
  },
  bottomSpace: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  placeOrderButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default CheckoutScreen;