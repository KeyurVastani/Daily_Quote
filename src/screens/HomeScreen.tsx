import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { useFavorites } from '../hooks/useFavorites';
import { QuoteCard } from '../components/QuoteCard';
import type { RootStackParamList } from '../navigation/types';

function buildShareMessage(text: string, author?: string) {
  return author ? `${text}\n- ${author}` : text;
}

export function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { quote, loading, error } = useDailyQuote();
  const { isFavorited, toggleFavorite } = useFavorites();

  const onShare = useCallback(async () => {
    if (!quote) return;
    try {
      await Share.share({ message: buildShareMessage(quote.text, quote.author) });
    } catch {
      // ignore (cancelled, etc.)
    }
  }, [quote]);

  return (
    <LinearGradient colors={['#E0F2FE', '#FFFFFF', '#FCE7F3']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Daily Quote</Text>
          <Text style={styles.subtitle}>A thought for today</Text>
        </View>

        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => navigation.navigate('Favorites')}
          accessibilityRole="button"
          accessibilityLabel="Go to favorites"
        >
          <Text style={styles.favoritesButtonText}>Favorites</Text>
        </TouchableOpacity>
      </View>

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-start' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
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

