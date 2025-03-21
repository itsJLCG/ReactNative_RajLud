import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { store } from './src/store/store';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SingleProductScreen from './src/screens/SingleProductScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AdminScreen from './src/screens/Admin/AdminScreen';
import ManageProductsScreen from './src/screens/Admin/ManageProductsScreen';
import AddProductScreen from './src/screens/Admin/AddProductScreen';
import ManageCategoriesScreen from './src/screens/Admin/ManageCategoriesScreen';
import AddCategoryScreen from './src/screens/Admin/AddCategoryScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const AdminStack = createStackNavigator();

// Profile stack for nested navigation from profile tab
const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="MyOrders" component={MyOrdersScreen} />
      <ProfileStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <ProfileStack.Screen name="Reviews" component={ReviewsScreen} />
    </ProfileStack.Navigator>
  );
};

const AdminStackScreen = () => {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminScreen} />
      <AdminStack.Screen name="ManageProducts" component={ManageProductsScreen} />
      <AdminStack.Screen name="AddProduct" component={AddProductScreen} />
      <AdminStack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
      <AdminStack.Screen name="AddCategory" component={AddCategoryScreen} />
      {/* <AdminStack.Screen name="EditProduct" component={EditProductScreen} /> */}
    </AdminStack.Navigator>
  );
};

// Bottom tabs navigation after login
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#38761d',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{
          title: "Home"
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackScreen} 
        options={{
          title: "Profile"
        }}
      />
    </Tab.Navigator>
  );
};

// Home stack for nested navigation from home tab
const HomeStackNav = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeStackNav.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#38761d',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <HomeStackNav.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "R&L Edge Wear",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Cart')}
              style={styles.headerButton}
            >
              <Ionicons name="cart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStackNav.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{
          title: "Your Cart"
        }}
      />
      <HomeStackNav.Screen 
        name="SingleProduct" 
        component={SingleProductScreen} 
        options={({ route }) => ({
          title: "Product Details"
        })}
      />
      <HomeStackNav.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{
          title: "Checkout"
        }}
      />
    </HomeStackNav.Navigator>
  );
};

// Main app component with authentication flow
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="MainApp" component={MainTabs} />
          <Stack.Screen name="AdminApp" component={AdminStackScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 15,
  },
});

export default App;