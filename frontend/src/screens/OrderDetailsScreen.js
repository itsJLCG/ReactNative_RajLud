import React, { useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../actions/orderActions';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId]);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#38761d" />
      </SafeAreaView>
    );
  }

  if (error || !currentOrder) {
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
          <Ionicons name="arrow-back" size={24} color="#38761d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{currentOrder.id}</Text>
              <Text style={styles.orderDate}>Placed on {formatDate(currentOrder.date)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentOrder.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(currentOrder.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(currentOrder.status) }]}>{currentOrder.status}</Text>
            </View>
          </View>
        </View>

        {/* Tracking Information Card */}
        {currentOrder.trackingNumber && currentOrder.trackingNumber !== 'Pending' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tracking Information</Text>
            </View>

            <View style={styles.trackingInfo}>
              <Text style={styles.trackingLabel}>Tracking Number:</Text>
              <Text style={styles.trackingNumber}>{currentOrder.trackingNumber}</Text>
            </View>

            {currentOrder.trackingHistory && (
              <View style={styles.trackingTimeline}>
                {currentOrder.trackingHistory.map((event, index) => (
                  <View key={index} style={styles.trackingEvent}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, { backgroundColor: getStatusColor(event.status) }]} />
                      {index !== currentOrder.trackingHistory.length - 1 && <View style={styles.timelineLine} />}
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

          {currentOrder.items.map((item) => (
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
            <Text style={styles.addressName}>{currentOrder.shippingAddress.name}</Text>
            <Text style={styles.addressLine}>{currentOrder.shippingAddress.street}</Text>
            <Text style={styles.addressLine}>
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zip}
            </Text>
            <Text style={styles.addressLine}>{currentOrder.shippingAddress.country}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.shippingMethod}>
            <Text style={styles.shippingMethodLabel}>Shipping Method:</Text>
            <Text style={styles.shippingMethodValue}>{currentOrder.shippingMethod}</Text>
          </View>
        </View>

        {/* Payment Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Payment Information</Text>
          </View>

          <View style={styles.paymentMethod}>
            <Ionicons name="card-outline" size={22} color="#38761d" style={styles.paymentIcon} />
            <Text style={styles.paymentText}>{currentOrder.paymentMethod}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${currentOrder.subtotal?.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>${currentOrder.shippingCost?.toFixed(2) || '0.00'}</Text>
            </View>
            {currentOrder.tax > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tax</Text>
                <Text style={styles.priceValue}>${currentOrder.tax.toFixed(2)}</Text>
              </View>
            )}
            {currentOrder.discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={styles.priceValue}>-${currentOrder.discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${currentOrder.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {currentOrder.status !== 'Delivered' && currentOrder.status !== 'Cancelled' && (
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
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#38761d" />
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
    backgroundColor: '#38761d',
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
    color: '#38761d',
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
    color: '#38761d',
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
    color: '#38761d',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  }
});

export default OrderDetailsScreen;