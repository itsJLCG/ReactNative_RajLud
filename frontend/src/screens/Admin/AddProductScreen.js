import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../actions/productActions';
import { fetchCategories } from '../../actions/categoryActions';

const AddProductScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const validateForm = () => {
    let tempErrors = {};
    if (!product.name.trim()) tempErrors.name = 'Product name is required';
    if (!product.price) tempErrors.price = 'Price is required';
    if (!product.description.trim()) tempErrors.description = 'Description is required';
    if (!product.category) tempErrors.category = 'Category is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSelectCategory = (category) => {
    setProduct({ ...product, category: category._id });
    setShowCategoryModal(false);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        const result = await dispatch(createProduct({
          ...product,
          price: parseFloat(product.price)
        }));

        if (result.success) {
          Alert.alert(
            'Success',
            'Product created successfully',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        } else {
          Alert.alert('Error', result.message || 'Failed to create product');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to create product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleSelectCategory(item)}
    >
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryDescription} numberOfLines={1}>{item.description}</Text>
    </TouchableOpacity>
  );

  const selectedCategory = categories?.find(cat => cat._id === product.category);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#38761d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={product.name}
              onChangeText={(text) => setProduct({...product, name: text})}
              placeholder="Enter product name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={product.price}
              onChangeText={(text) => setProduct({...product, price: text})}
              placeholder="Enter price"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={[styles.categorySelector, errors.category && styles.inputError]}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={[
                styles.categorySelectorText,
                selectedCategory ? styles.selectedCategory : styles.placeholderText
              ]}>
                {selectedCategory ? selectedCategory.name : 'Select a category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              value={product.description}
              onChangeText={(text) => setProduct({...product, description: text})}
              placeholder="Enter product description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.categoryList}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 100,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    backgroundColor: '#38761d',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  categorySelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySelectorText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  selectedCategory: {
    color: '#1F2937',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    padding: 16,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default AddProductScreen;