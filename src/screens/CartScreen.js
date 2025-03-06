import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../actions/cartActions';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={() => handleRemoveItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${calculateTotal()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>$5.00</Text>
            </View>
            <View style={[styles.totalRow, styles.finalRow]}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>${(parseFloat(calculateTotal()) + 5).toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add items to get started</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  quantityContainer: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  quantityText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
    flexDirection: 'row',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  totalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  finalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  checkoutButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  continueShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;