import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const DECOR = ['✦', '✧', '★', '✿', '❀', '˚'];

type Props = { children: React.ReactNode };

/**
 * Pastel sky, soft clouds, and scattered sparkles — matches a warm “daily quotes” mood.
 */
export function DreamyHomeBackground({ children }: Props) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const decorTranslate = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FFB8D9', '#E8C4FF', '#B8DEFF', '#FFE5CC']}
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)', 'rgba(255,248,220,0.35)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Clouds */}
      <View pointerEvents="none" style={styles.cloudLayer}>
        {/* <View style={[styles.cloud, styles.cloud1]} />
        <View style={[styles.cloud, styles.cloud2]} />
        <View style={[styles.cloud, styles.cloud3]} /> */}
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.sparkleLayer, { transform: [{ translateY: decorTranslate }] }]}
      >
        {DECOR.map((ch, i) => {
          const p = SPARKLE_POS[i % SPARKLE_POS.length];
          return (
            <Text
              key={i}
              style={[
                styles.sparkle,
                { top: p.top, left: p.left, right: p.right, fontSize: p.fontSize, opacity: p.opacity },
              ]}
            >
              {ch}
            </Text>
          );
        })}
      </Animated.View>

      {children}
    </View>
  );
}

const SPARKLE_POS: {
  top: `${number}%`;
  left?: `${number}%`;
  right?: `${number}%`;
  fontSize: number;
  opacity: number;
}[] = [
  { top: '12%', left: '8%', fontSize: 14, opacity: 0.7 },
  { top: '18%', right: '12%', fontSize: 11, opacity: 0.55 },
  { top: '42%', left: '4%', fontSize: 12, opacity: 0.5 },
  { top: '38%', right: '6%', fontSize: 16, opacity: 0.65 },
  { top: '62%', left: '10%', fontSize: 10, opacity: 0.45 },
  { top: '58%', right: '14%', fontSize: 13, opacity: 0.6 },
];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFD6E8',
  },
  cloudLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
  },
  cloud1: {
    width: 120,
    height: 44,
    bottom: '8%',
    left: '-5%',
    transform: [{ scaleX: 1.2 }],
  },
  cloud2: {
    width: 160,
    height: 52,
    bottom: '4%',
    right: '-8%',
    opacity: 0.85,
  },
  cloud3: {
    width: 90,
    height: 36,
    bottom: '14%',
    left: '35%',
    opacity: 0.7,
  },
  sparkleLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  sparkle: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
