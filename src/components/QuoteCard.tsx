import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Quote } from '../types/quote';

export function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onShare,
}: {
  quote: Quote;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.quoteText}>{quote.text}</Text>
      {quote.author ? <Text style={styles.author}>- {quote.author}</Text> : null}

      {(onToggleFavorite || onShare) && (
        <View style={styles.actions}>
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={onToggleFavorite}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Unfavorite quote' : 'Favorite quote'}
            >
              <Text style={styles.heart}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          )}

          {onShare && (
            <TouchableOpacity
              onPress={onShare}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Share quote"
            >
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 24,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#111827',
  },
  author: {
    marginTop: 12,
    fontSize: 14,
    color: '#374151',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  heart: {
    fontSize: 20,
    color: '#DB2777',
    fontWeight: '700',
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
});

