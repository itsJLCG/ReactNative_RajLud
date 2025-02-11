import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ShopScreen from './screens/ShopScreen'; // Ensure the path is correct based on your folder structure

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ShopScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
