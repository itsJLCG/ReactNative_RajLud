import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import CartScreen from '../screens/CartScreen';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // Hide header by default
        drawerActiveTintColor: '#38761d',
        drawerInactiveTintColor: '#4B5563',
        drawerStyle: {
          width: width * 0.75,
        }
      }}
    >
      <Drawer.Screen 
        name="HomeDrawer"
        component={HomeStack}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ProfileDrawer" 
        component={ProfileStack}
        options={{
          title: 'Profile',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="CartDrawer" 
        component={CartScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show header only for cart
          title: 'My Cart',
          headerTitle: 'My Cart',
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
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          drawerIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={22} color={color} />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;