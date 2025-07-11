// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <PaperProvider>
      <View style={styles.background}>
        <Stack />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f5f6fa', // Soft light background
  },
});
