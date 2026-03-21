import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { useFavorites } from '../hooks/useFavorites';
import { QuoteCard } from '../components/QuoteCard';
import { CommonHeader } from '../components/common/CommonHeader';
import { ExploreRoundHeaderButton } from '../components/ExploreRoundHeaderButton';
import { ExploreCategoriesDrawer } from '../components/ExploreCategoriesDrawer';
import type { RootStackParamList } from '../navigation/types';
import { AnimatedGradientBackground } from '../components/common/AnimatedGradientBackground';
import { formatDateHuman } from '../utils/date';
import type { Quote } from '../types/quote';

function buildShareMessage(text: string, author?: string) {
  return author ? `${text}\n- ${author}` : text;
}

export function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { quote, loading, error } = useDailyQuote();
  const { isFavorited, toggleFavorite } = useFavorites();
  const todayLabel = formatDateHuman(new Date());

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryQuote, setCategoryQuote] = useState<Quote | null>(null);

  const onShare = useCallback(async () => {
    if (!quote) return;
    try {
      await Share.share({ message: buildShareMessage(quote.text, quote.author) });
    } catch {
      // ignore (cancelled, etc.)
    }
  }, [quote]);

  const onShareCategory = useCallback(async () => {
    if (!categoryQuote) return;
    try {
      await Share.share({
        message: buildShareMessage(categoryQuote.text, categoryQuote.author),
      });
    } catch {
      // ignore
    }
  }, [categoryQuote]);

  return (
    <AnimatedGradientBackground>
      <CommonHeader
        title="Daily Quote"
        subtitle={`Quote for ${todayLabel}`}
        left={<ExploreRoundHeaderButton onPress={() => setDrawerOpen(true)} />}
        right={
          <TouchableOpacity
            style={styles.headerPill}
            onPress={() => navigation.navigate('Favorites')}
            accessibilityRole="button"
            accessibilityLabel="Go to favorites"
          >
            <Text style={styles.headerPillText}>Favorites</Text>
          </TouchableOpacity>
        }
      />

      <ExploreCategoriesDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onQuoteLoaded={setCategoryQuote}
      />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : quote ? (
          <>
            <QuoteCard
              quote={quote}
              isFavorite={isFavorited(quote)}
              onToggleFavorite={() => toggleFavorite(quote)}
              onShare={onShare}
            />
            {categoryQuote ? (
              <View style={styles.categoryBlock}>
                <Text style={styles.categoryLabel}>From your categories</Text>
                <QuoteCard
                  quote={categoryQuote}
                  isFavorite={isFavorited(categoryQuote)}
                  onToggleFavorite={() => toggleFavorite(categoryQuote)}
                  onShare={onShareCategory}
                />
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.errorText}>No quote available.</Text>
        )}
      </View>
    </AnimatedGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  headerPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  categoryBlock: {
    marginTop: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  errorText: { marginTop: 22, paddingHorizontal: 16, color: '#B91C1C', fontSize: 14 },
});
