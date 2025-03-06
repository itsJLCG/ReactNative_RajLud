import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your API
        // const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`);
        // const data = await response.json();

        // Simulated data delay
        setTimeout(() => {
          // Sample data - this should match the selected order from MyOrdersScreen
          if (orderId === 'ORD-12345') {
            setOrder({
              id: 'ORD-12345',
              date: '2025-02-28',
              status: 'Delivered',
              total: 129.99,
              items: [
                {
                  id: 1,
                  name: 'Wireless Bluetooth Headphones',
                  quantity: 1,
                  price: 79.99,
                  image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg'
                },
                {
                  id: 2,
                  name: 'Smart Watch Series 5',
                  quantity: 1,
                  price: 49.99,
                  image: 'https://fakestoreapi.com/img/71Swqqe7XAL._AC_SX466_.jpg'
                }
              ],
              shippingAddress: {
                name: 'John Doe',
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'United States'
              },
              paymentMethod: 'Credit Card (•••• 4242)',
              shippingMethod: 'Express Shipping',
              subtotal: 129.98,
              shippingCost: 0,
              tax: 10.01,
              discount: 10.00,
              trackingNumber: 'TRK928192819',
              deliveredDate: '2025-03-03',
              trackingHistory: [
                {
                  status: 'Delivered',
                  date: '2025-03-03',
                  location: 'New York, NY'
                },
                {
                  status: 'Out for delivery',
                  date: '2025-03-03',
                  location: 'Local Delivery Facility, NY'
                },
                {
                  status: 'Shipped',
                  date: '2025-03-01',
                  location: 'Distribution Center, NJ'
                },
                {
                  status: 'Order processed',
                  date: '2025-02-28',
                  location: 'Warehouse'
                }
              ]
            });
          } else if (orderId === 'ORD-12346') {
            setOrder({
              id: 'ORD-12346',
              date: '2025-02-15',
              status: 'Shipped',
              total: 79.95,
              items: [
                {
                  id: 3,
                  name: 'Portable External SSD 1TB',
                  quantity: 1,
                  price: 79.95,
                  image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg'
                }
              ],
              shippingAddress: {
                name: 'John Doe',
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'United States'
              },
              paymentMethod: 'PayPal',
              shippingMethod: 'Standard Shipping',
              subtotal: 79.95,
              shippingCost: 4.99,
              tax: 6.99,
              discount: 12.00,
              trackingNumber: 'TRK828172615',
              trackingHistory: [
                {
                  status: 'Shipped',
                  date: '2025-02-18',
                  location: 'Distribution Center, CA'
                },
                {
                  status: 'Order processed',
                  date: '2025-02-15',
                  location: 'Warehouse'
                }
              ]
            });
          } else {
            // Generic order for IDs we don't have predefined data for
            setOrder({
              id: orderId,
              date: '2025-01-30',
              status: 'Processing',
              total: 99.99,
              items: [
                {
                  id: 5,
                  name: 'Generic Product',
                  quantity: 1,
                  price: 99.99,
                  image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
                }
              ],
              shippingAddress: {
                name: 'John Doe',
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'United States'
              },
              paymentMethod: 'Credit Card',
              shippingMethod: 'Standard Shipping',
              subtotal: 99.99,
              shippingCost: 4.99,
              tax: 8.75,
              discount: 0,
              trackingNumber: 'Pending'
            });
          }
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load order details');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return '#10B981'; // green
      case 'Shipped':
        return '#3B82F6'; // blue
      case 'Out for delivery':
        return '#8B5CF6'; // purple
      case 'Processing':
        return '#F59E0B'; // amber
      case 'Cancelled':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel Order",
          style: "destructive",
          onPress: () => {
            // In real app, this would make an API call
            Alert.alert("Order Cancelled", "Your order has been cancelled successfully.");
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "How would you like to contact customer support?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Email",
          onPress: () => console.log("Email support")
        },
        {
          text: "Call",
          onPress: () => console.log("Call support")
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
        <Text style={styles.errorText}>{error || "Order not found"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>Placed on {formatDate(order.date)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Tracking Information Card */}
        {order.trackingNumber && order.trackingNumber !== 'Pending' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tracking Information</Text>
            </View>

            <View style={styles.trackingInfo}>
              <Text style={styles.trackingLabel}>Tracking Number:</Text>
              <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
            </View>

            {order.trackingHistory && (
              <View style={styles.trackingTimeline}>
                {order.trackingHistory.map((event, index) => (
                  <View key={index} style={styles.trackingEvent}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, { backgroundColor: getStatusColor(event.status) }]} />
                      {index !== order.trackingHistory.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.trackingStatus}>{event.status}</Text>
                      <Text style={styles.trackingDate}>{formatDate(event.date)}</Text>
                      <Text style={styles.trackingLocation}>{event.location}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Order Items Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Items in Your Order</Text>
          </View>

          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Shipping Address</Text>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
            <Text style={styles.addressLine}>{order.shippingAddress.street}</Text>
            <Text style={styles.addressLine}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </Text>
            <Text style={styles.addressLine}>{order.shippingAddress.country}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.shippingMethod}>
            <Text style={styles.shippingMethodLabel}>Shipping Method:</Text>
            <Text style={styles.shippingMethodValue}>{order.shippingMethod}</Text>
          </View>
        </View>

        {/* Payment Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Payment Information</Text>
          </View>

          <View style={styles.paymentMethod}>
            <Ionicons name="card-outline" size={22} color="#1E3A8A" style={styles.paymentIcon} />
            <Text style={styles.paymentText}>{order.paymentMethod}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${order.subtotal?.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>${order.shippingCost?.toFixed(2) || '0.00'}</Text>
            </View>
            {order.tax > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tax</Text>
                <Text style={styles.priceValue}>${order.tax.toFixed(2)}</Text>
              </View>
            )}
            {order.discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={styles.priceValue}>-${order.discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={handleCancelOrder}
            >
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.supportButton]} 
            onPress={handleContactSupport}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1E3A8A" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackingLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  trackingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  trackingTimeline: {
    marginTop: 8,
  },
  trackingEvent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 2,
    marginLeft: 5,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 8,
  },
  trackingStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  trackingDate: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  trackingLocation: {
    fontSize: 13,
    color: '#6B7280',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  addressContainer: {
    marginBottom: 16,
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  shippingMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingMethodLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  shippingMethodValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentText: {
    fontSize: 14,
    color: '#1F2937',
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
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  supportButton: {
    backgroundColor: '#EEF2FF',
    marginLeft: 8,
  },
  supportButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  }
});

export default OrderDetailsScreen;