import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../constants/actionTypes';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // Default profile image with user's initials
  const defaultImage = 'https://ui-avatars.com/api/?name=' + 
    encodeURIComponent(user?.name || 'User') + 
    '&background=38761d&color=fff&size=200';

  const statsItems = [
    { 
      icon: 'cart', 
      value: user?.orders?.length || 0,
      label: 'Orders'
    },
    { 
      icon: 'star', 
      value: user?.reviews?.length || 0,
      label: 'Reviews'
    },
    { 
      icon: 'heart', 
      value: user?.wishlist?.length || 0,
      label: 'Wishlist'
    },
  ];

  const menuItems = [
    { 
      icon: 'cart-outline', 
      title: 'My Orders', 
      badge: user?.orders?.length || 0,
      onPress: () => navigation.navigate('MyOrders')
    },
    { 
      icon: 'star-outline', 
      title: 'My Reviews', 
      badge: user?.reviews?.length || 0,
      onPress: () => navigation.navigate('Reviews')
    },
    { 
      icon: 'heart-outline', 
      title: 'My Wishlist',
      badge: user?.wishlist?.length || 0,
      onPress: () => navigation.navigate('Wishlist')
    },
    { 
      icon: 'location-outline', 
      title: 'Delivery Address',
      onPress: () => navigation.navigate('Addresses')
    },
    { 
      icon: 'settings-outline', 
      title: 'Account Settings',
      onPress: () => navigation.navigate('Settings')
    },
    { 
      icon: 'help-circle-outline', 
      title: 'Help & Support',
      onPress: () => navigation.navigate('Support')
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: LOGOUT });
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  const handleMenuPress = (item) => {
    if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user?.image || defaultImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
            <View style={styles.profileMetaContainer}>
              {user?.role && (
                <View style={styles.roleContainer}>
                  <Ionicons 
                    name={user.role === 'admin' ? 'shield-checkmark' : 'person'} 
                    size={14} 
                    color="#38761d" 
                  />
                  <Text style={styles.roleText}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                </View>
              )}
              {user?.memberSince && (
                <Text style={styles.memberSince}>
                  Member since {new Date(user.memberSince).getFullYear()}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={20} color="#38761d" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {statsItems.map((item, index) => (
            <View key={index} style={styles.statsItem}>
              <View style={styles.statsIconContainer}>
                <Ionicons name={item.icon} size={22} color="#38761d" />
              </View>
              <Text style={styles.statsValue}>{item.value}</Text>
              <Text style={styles.statsLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color="#38761d" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <View style={styles.menuRight}>
                {item.badge > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6', // Fallback color while loading
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#38761d',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    color: '#38761d',
    marginLeft: 4,
    fontWeight: '500',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  versionText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  profileMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#6B7280',
  }
});

export default ProfileScreen;