import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export function AnimatedGradientBackground({ children }: { children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E0F2FE', '#FFFFFF', '#FCE7F3']} style={StyleSheet.absoluteFill} />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { opacity: fadeAnim, transform: [{ scale: 1.02 }] },
        ]}
      >
        <LinearGradient colors={['#BFDBFE', '#FFFFFF', '#FBCFE8']} style={StyleSheet.absoluteFill} />
      </Animated.View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

