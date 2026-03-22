import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Heart, Lightbulb, Sparkles } from 'lucide-react-native';
import { DreamyHomeBackground } from '../home/DreamyHomeBackground';

/**
 * Full-screen launch branding — matches Home “Daily Quotes” look (pastel sky, playful title).
 */
export function AppSplashScreen() {
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 55,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [entrance, pulse]);

  const heroScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
  const heroOpacity = entrance.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const sparkOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <DreamyHomeBackground>
      <View style={[styles.center, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
        <Animated.View
          style={[styles.heroWrap, { opacity: heroOpacity, transform: [{ scale: heroScale }] }]}
        >
          <View style={styles.iconRow}>
            <Lightbulb color="#FBBF24" size={28} fill="#FEF08A" />
            <Animated.View style={{ opacity: sparkOpacity }}>
              <Sparkles color="#F59E0B" size={26} />
            </Animated.View>
            <Feather color="#F9FAFB" size={24} strokeWidth={2} />
            <Heart color="#F472B6" size={26} fill="#FBCFE8" />
          </View>

          <Text style={styles.title} accessibilityRole="header">
            <Text style={styles.titleDaily}>Daily </Text>
            <Text style={styles.titleQuotes}>Quotes</Text>
          </Text>

          <Text style={styles.tagline}>A little light for your day ✦</Text>
        </Animated.View>

        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.loaderHint}>Gathering inspiration…</Text>
        </View>
      </View>
    </DreamyHomeBackground>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 22,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  titleDaily: {
    fontSize: 42,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleQuotes: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textShadowColor: 'rgba(147, 197, 253, 0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(30, 58, 95, 0.82)',
    textAlign: 'center',
    lineHeight: 24,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: '12%',
    alignItems: 'center',
    gap: 12,
  },
  loaderHint: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(30, 58, 95, 0.65)',
  },
});
