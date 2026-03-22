import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppSplashScreen } from './AppSplashScreen';

/** Time splash stays fully visible before fade-out (ms). */
export const SPLASH_VISIBLE_MS = 2000;
const FADE_OUT_MS = 500;

type Props = {
  children: React.ReactNode;
};

/**
 * Renders children underneath, shows branded splash on top, then fades and unmounts overlay.
 */
export function SplashOverlay({ children }: Props) {
  const [showOverlay, setShowOverlay] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const showTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setShowOverlay(false);
      });
    }, SPLASH_VISIBLE_MS);

    return () => clearTimeout(showTimer);
  }, [opacity]);

  return (
    <View style={styles.root}>
      {children}
      {showOverlay ? (
        <Animated.View
          style={[styles.overlay, { opacity }]}
          pointerEvents="auto"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <AppSplashScreen />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
});
