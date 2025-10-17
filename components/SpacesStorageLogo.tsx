
import React from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SpacesStorageLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function SpacesStorageLogo({ size = 'medium', style }: SpacesStorageLogoProps) {
  const logoSizes = {
    small: { width: 120, height: 48 },
    medium: { width: 180, height: 72 },
    large: { width: 240, height: 96 }
  };

  const currentSize = logoSizes[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/assets/images/47233204-4362-4748-9ea0-f457d65a9584.png')}
        style={[styles.logo, currentSize]}
        contentFit="contain"
        transition={300}
        alt="Spaces Storage Group Logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // No border radius needed for the logo
  },
});
