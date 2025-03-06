import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const SingleProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();

  // Sample reviews - in a real app, these would come from an API
  const [reviews, setReviews] = useState([
    {
      id: 1,
      username: 'Jane Doe',
      date: '2024-02-15',
      rating: 5,
      comment: 'Excellent product! Works exactly as described and arrived quickly.',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      id: 2,
      username: 'John Smith',
      date: '2024-02-10',
      rating: 4,
      comment: 'Very good quality for the price. Would recommend.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      username: 'Amanda Garcia',
      date: '2024-01-28',
      rating: 3,
      comment: 'Decent product but took longer than expected to arrive.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ]);
  
  // Fetch single product
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      // Add the selected quantity to cart
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
      // Show feedback (you could add a toast notification here)
      navigation.navigate('Cart');
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };
  
  const submitReview = () => {
    if (rating === 0 || !reviewText.trim()) {
      // Show error (you could add an alert here)
      return;
    }
    
    // Add the new review to the list
    const newReview = {
      id: Date.now(),
      username: 'You', // In a real app, this would be the logged in user
      date: new Date().toISOString().split('T')[0],
      rating,
      comment: reviewText,
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    };
    
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setRating(0);
  };
  
  const renderStars = (count) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Ionicons 
            key={star}
            name={star <= count ? "star" : "star-outline"} 
            size={16} 
            color="#FFD700" 
          />
        ))}
      </View>
    );
  };
  
  const renderRatingPicker = () => {
    return (
      <View style={styles.ratingPicker}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity 
            key={star} 
            onPress={() => setRating(star)}
          >
            <Ionicons 
              name={star <= rating ? "star" : "star-outline"} 
              size={28} 
              color="#FFD700" 
              style={styles.ratingPickerStar}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }
  
  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.title}</Text>
          
          <View style={styles.priceRatingContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(product.rating?.rate || 4)}
              <Text style={styles.ratingText}>{product.rating?.rate || '4.0'} ({product.rating?.count || reviews.length})</Text>
            </View>
          </View>
          
          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={quantity <= 1 ? "#D1D5DB" : "#1E3A8A"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                <Ionicons name="add" size={20} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
          
          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={22} color="#fff" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
        
        {/* Reviews Section */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>Customer Reviews</Text>
          
          {/* Write a Review */}
          <View style={styles.writeReviewContainer}>
            <Text style={styles.writeReviewTitle}>Write a Review</Text>
            {renderRatingPicker()}
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your thoughts about this product..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
            />
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                (!reviewText.trim() || rating === 0) && styles.disabledButton
              ]} 
              onPress={submitReview}
              disabled={!reviewText.trim() || rating === 0}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
          
          {/* Reviews List */}
          <FlatList
            data={reviews}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: item.avatar }} style={styles.reviewerAvatar} />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{item.username}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                  </View>
                  {renderStars(item.rating)}
                </View>
                <Text style={styles.reviewComment}>{item.comment}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  imageContainer: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    alignItems: 'center',
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    color: '#6B7280',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginRight: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  addToCartButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewsContainer: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  writeReviewContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  writeReviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  ratingPicker: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ratingPickerStar: {
    marginRight: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  }
});

export default SingleProductScreen;