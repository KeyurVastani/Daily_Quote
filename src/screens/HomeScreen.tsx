import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { useFavorites } from '../hooks/useFavorites';
import { QuoteCard } from '../components/QuoteCard';
import { CommonHeader } from '../components/common/CommonHeader';
import type { RootStackParamList } from '../navigation/types';
import { AnimatedGradientBackground } from '../components/common/AnimatedGradientBackground';
import { formatDateHuman } from '../utils/date';

function buildShareMessage(text: string, author?: string) {
  return author ? `${text}\n- ${author}` : text;
}

export function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { quote, loading, error } = useDailyQuote();
  const { isFavorited, toggleFavorite } = useFavorites();
  const todayLabel = formatDateHuman(new Date());

  const onShare = useCallback(async () => {
    if (!quote) return;
    try {
      await Share.share({ message: buildShareMessage(quote.text, quote.author) });
    } catch {
      // ignore (cancelled, etc.)
    }
  }, [quote]);

  return (
    <AnimatedGradientBackground>
      <CommonHeader
        title="Daily Quote"
        subtitle={`Quote for ${todayLabel}`}
        right={
          <TouchableOpacity
            style={styles.favoritesButton}
            onPress={() => navigation.navigate('Favorites')}
            accessibilityRole="button"
            accessibilityLabel="Go to favorites"
          >
            <Text style={styles.favoritesButtonText}>Favorites</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : quote ? (
          <QuoteCard
            quote={quote}
            isFavorite={isFavorited(quote)}
            onToggleFavorite={() => toggleFavorite(quote)}
            onShare={onShare}
          />
        ) : (
          <Text style={styles.errorText}>No quote available.</Text>
        )}
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'flex-start' },
  favoritesButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    marginLeft: 8,
  },
  favoritesButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { marginTop: 22, paddingHorizontal: 16, color: '#B91C1C', fontSize: 14 },
});

