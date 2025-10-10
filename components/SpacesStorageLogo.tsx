
import React from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SpacesStorageLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function SpacesStorageLogo({ size = 'medium', style }: SpacesStorageLogoProps) {
  const logoSizes = {
    small: { width: 80, height: 32 },
    medium: { width: 120, height: 48 },
    large: { width: 160, height: 64 }
  };

  const currentSize = logoSizes[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=160&fit=crop&crop=center"
        style={[styles.logo, currentSize]}
        contentFit="contain"
        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
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
    borderRadius: 8,
  },
});
