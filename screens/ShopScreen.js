import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const products = [
  { id: '1', name: 'Luxury Watch', price: '$250', category: 'Watches', image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Leather Bag', price: '$150', category: 'Bags', image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Designer Shoes', price: '$300', category: 'Shoes', image: 'https://via.placeholder.com/100' },
  { id: '4', name: 'Silk Scarf', price: '$75', category: 'Clothing', image: 'https://via.placeholder.com/100' },
  { id: '5', name: 'Sports Watch', price: '$180', category: 'Watches', image: 'https://via.placeholder.com/100' },
];

const categories = [
  { id: '1', title: 'All', icon: 'grid' },
  { id: '2', title: 'Watches', icon: 'clock-time-four' },
  { id: '3', title: 'Bags', icon: 'briefcase' },
  { id: '4', title: 'Shoes', icon: 'shoe-laced' },
  { id: '5', title: 'Clothing', icon: 'tshirt-crew' },
];

const ShopScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [animation] = useState(new Animated.Value(0)); // Initial animation value

  // Search handler
  const handleSearch = (text) => {
    setSearchText(text);
    filterProducts(selectedCategory, text);
  };

  // Category selection handler
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterProducts(category, searchText);
  };

  // Filter products based on category and search
  const filterProducts = (category, search) => {
    let filtered = products;

    if (category !== 'All') {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);

    // Trigger animation for viewing product details
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Handle back to product list
  const handleBackToProducts = () => {
    setSelectedProduct(null);
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedProduct ? (
        // If a product is selected, show its details
        <Animated.View
          style={[
            styles.productDetailContainer,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 0], // Animation from bottom to top
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={handleBackToProducts} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} color="#333" />
            <Text style={styles.backButtonText}>Back to Products</Text>
          </TouchableOpacity>

          <Image source={{ uri: selectedProduct.image }} style={styles.productImage} />
          <Text style={styles.productName}>{selectedProduct.name}</Text>
          <Text style={styles.productPrice}>{selectedProduct.price}</Text>
          
          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#555" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item.title && styles.activeCategory,
                  ]}
                  onPress={() => handleCategorySelect(item.title)}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={selectedCategory === item.title ? '#fff' : '#333'}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item.title && styles.activeCategoryText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Products */}
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsContainer}
            ListEmptyComponent={<Text style={styles.noResultsText}>No products found.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => handleProductSelect(item)}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeCategory: {
    backgroundColor: '#ff85c1',
  },
  categoryText: {
    marginTop: 6,
    fontSize: 14,
    color: '#777',
  },
  activeCategoryText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  productsContainer: {
    paddingBottom: 100,
  },
  productCard: {
    flex: 1,
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 5,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#f4f4f4',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#ff85c1',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#ff85c1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 16,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
  productDetailContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
});

export default ShopScreen;
