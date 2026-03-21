import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Share } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFavorites } from '../hooks/useFavorites';
import type { Quote } from '../types/quote';
import { QuoteCard } from '../components/QuoteCard';
import { CommonHeader } from '../components/common/CommonHeader';
import { AnimatedGradientBackground } from '../components/common/AnimatedGradientBackground';
import type { RootStackParamList } from '../navigation/types';
import { ArrowLeft } from 'lucide-react-native';

function buildShareMessage(quote: Quote) {
  return quote.author ? `${quote.text}\n- ${quote.author}` : quote.text;
}

export function FavoritesScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Favorites'>) {
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
        left={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backTouchable}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft />
          </TouchableOpacity>
        }
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
  backTouchable: {
    paddingVertical: 6,
    paddingRight: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' ,alignItems:'center'},
  emptyText: { color: '#6B7280', fontSize: 14, lineHeight: 20 },
  listContent: { paddingBottom: 24 },
});

