import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Share } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFavorites } from '../hooks/useFavorites';
import type { Quote } from '../types/quote';
import { QuoteCard } from '../components/QuoteCard';

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
    <LinearGradient colors={['#E0F2FE', '#FFFFFF', '#FCE7F3']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
        <Text style={styles.subtitle}>{favorites.length} saved</Text>
      </View>

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  emptyText: { color: '#6B7280', fontSize: 14, lineHeight: 20 },
  listContent: { paddingBottom: 24 },
});

