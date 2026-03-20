import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Share } from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import type { Quote } from '../types/quote';
import { QuoteCard } from '../components/QuoteCard';
import { CommonHeader } from '../components/common/CommonHeader';
import { AnimatedGradientBackground } from '../components/common/AnimatedGradientBackground';

function buildShareMessage(quote: Quote) {
  return quote.author ? `${quote.text}\n- ${quote.author}` : quote.text;
}

export function FavoritesScreen() {
  const { favorites, loading, isFavorited, toggleFavorite } = useFavorites();

  const onShare = useCallback(async (quote: Quote) => {
    try {
      await Share.share({ message: buildShareMessage(quote) });
    } catch {
      // Ignore share failures (user cancelled, etc.).
    }
  }, []);

  return (
    <AnimatedGradientBackground>
      <CommonHeader
        title="Your Favorites"
        subtitle={`${favorites.length} saved`}
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No favorites yet. Tap the heart on a quote.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <QuoteCard
              quote={item}
              isFavorite={isFavorited(item)}
              onToggleFavorite={() => toggleFavorite(item)}
              onShare={() => onShare(item)}
            />
          )}
        />
      )}
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  emptyText: { color: '#6B7280', fontSize: 14, lineHeight: 20 },
  listContent: { paddingBottom: 24 },
});

