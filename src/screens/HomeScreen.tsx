import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Heart, Lightbulb, Sparkles, Feather, Sun, RefreshCw } from 'lucide-react-native';
import { fetchRandomQuote, fetchRandomQuoteByCategories } from '../api/quotesApi';
import { readSelectedCategoriesFromStorage } from '../hooks/usePersistedCategorySelection';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { useFavorites } from '../hooks/useFavorites';
import { ExploreRoundHeaderButton } from '../components/ExploreRoundHeaderButton';
import { ExploreCategoriesDrawer } from '../components/ExploreCategoriesDrawer';
import { DreamyHomeBackground } from '../components/home/DreamyHomeBackground';
import { WhimsicalQuoteCard } from '../components/home/WhimsicalQuoteCard';
import type { RootStackParamList } from '../navigation/types';
import { formatDateHuman } from '../utils/date';
import type { Quote } from '../types/quote';

type HomeTab = 'today' | 'new';

function buildShareMessage(text: string, author?: string) {
  return author ? `${text}\n- ${author}` : text;
}

export function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const insets = useSafeAreaInsets();
  const { quote, loading, error } = useDailyQuote();
  const { isFavorited, toggleFavorite } = useFavorites();
  const todayLabel = formatDateHuman(new Date());

  const [tab, setTab] = useState<HomeTab>('today');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryQuote, setCategoryQuote] = useState<Quote | null>(null);
  const [newQuoteLoading, setNewQuoteLoading] = useState(false);
  const [newQuoteError, setNewQuoteError] = useState<string | null>(null);

  const loadNewQuote = useCallback(async () => {
    try {
      setNewQuoteLoading(true);
      setNewQuoteError(null);
      const selected = await readSelectedCategoriesFromStorage();
      const trimmed = selected.map((c) => c.trim()).filter(Boolean);

      const apiQuote =
        trimmed.length > 0
          ? await fetchRandomQuoteByCategories(trimmed)
          : await fetchRandomQuote();

      const q: Quote = {
        id: `new:${Date.now()}`,
        text: apiQuote.quote,
        author: apiQuote.author,
        work: apiQuote.work,
        categories: apiQuote.categories,
      };
      setCategoryQuote(q);
      setTab('new');
    } catch {
      setNewQuoteError('Could not load a quote. Check your connection and try again.');
    } finally {
      setNewQuoteLoading(false);
    }
  }, []);

  const onShareToday = useCallback(async () => {
    if (!quote) return;
    try {
      await Share.share({ message: buildShareMessage(quote.text, quote.author) });
    } catch {
      // ignore
    }
  }, [quote]);

  const onShareNew = useCallback(async () => {
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
    <DreamyHomeBackground>
      <View style={[styles.topSafe, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topBar}>
          <ExploreRoundHeaderButton onPress={() => setDrawerOpen(true)} />
          <TouchableOpacity
            style={styles.favoritesHeaderBtn}
            onPress={() => navigation.navigate('Favorites')}
            accessibilityRole="button"
            accessibilityLabel="Favorites"
          >
            <Heart color="#DC2626" size={18} fill="#FECACA" />
            <Text style={styles.favoritesHeaderText}>Favorites</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.titleIcons}>
            <Lightbulb color="#FBBF24" size={22} fill="#FEF08A" />
            <Feather color="#F9FAFB" size={20} strokeWidth={2} />
          </View>
          <Text style={styles.titleMain} accessibilityRole="header">
            <Text style={styles.titleDaily}>Daily </Text>
            <Text style={styles.titleQuotes}>Quotes</Text>
          </Text>
          <View style={styles.titleIcons}>
            <Heart color="#F472B6" size={20} fill="#FBCFE8" />
          </View>
        </View>
        <Text style={styles.subtitle}>{tab === 'today' ? `A little light for ${todayLabel}` : 'Fresh picks from your themes'}</Text>
      </View>

      <ExploreCategoriesDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onQuoteLoaded={(q) => {
          setNewQuoteError(null);
          setCategoryQuote(q);
          setTab('new');
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          tab === 'new' && categoryQuote ? styles.scrollContentWithBar : null,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {tab === 'today' ? (
          <>
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#EA580C" size="large" />
              </View>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : quote ? (
              <WhimsicalQuoteCard
                quote={quote}
                isFavorite={isFavorited(quote)}
                onToggleFavorite={() => toggleFavorite(quote)}
                onShare={onShareToday}
              />
            ) : (
              <Text style={styles.errorText}>No quote available.</Text>
            )}
          </>
        ) : (
          <>
            {!categoryQuote ? (
              <View style={styles.emptyNew}>
                <Text style={styles.emptyNewEmoji}>✦</Text>
                <Text style={styles.emptyNewTitle}>Discover a new quote</Text>
                <Text style={styles.emptyNewBody}>
                  Tap the round compass on the left, choose your favorite topics, then load a quote — it’ll
                  land here.
                </Text>
                <TouchableOpacity
                  style={styles.openDrawerBtn}
                  onPress={() => setDrawerOpen(true)}
                  activeOpacity={0.9}
                >
                  <Sparkles color="#92400E" size={20} />
                  <Text style={styles.openDrawerBtnText}>Open themes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <WhimsicalQuoteCard
                quote={categoryQuote}
                isFavorite={isFavorited(categoryQuote)}
                onToggleFavorite={() => toggleFavorite(categoryQuote)}
                onShare={onShareNew}
              />
            )}
          </>
        )}
      </ScrollView>

      {tab === 'new' && categoryQuote ? (
        <View style={styles.anotherQuoteBar}>
          {newQuoteError ? <Text style={styles.anotherQuoteError}>{newQuoteError}</Text> : null}
          <TouchableOpacity
            style={[styles.anotherQuoteBtn, newQuoteLoading && styles.anotherQuoteBtnDisabled]}
            onPress={loadNewQuote}
            disabled={newQuoteLoading}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Another quote"
          >
            {newQuoteLoading ? (
              <ActivityIndicator color="#78350F" size="small" />
            ) : (
              <RefreshCw color="#78350F" size={17} />
            )}
            <Text style={styles.anotherQuoteBtnText}>
              {newQuoteLoading ? 'Loading…' : 'Another quote'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={[styles.bottomTabs, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={[styles.tabPill, tab === 'today' ? styles.tabPillTodayActive : styles.tabPillIdle]}
          onPress={() => setTab('today')}
          activeOpacity={0.92}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'today' }}
        >
          {tab === 'today' ? (
            <Sun color="#2563EB" size={18} fill="#BFDBFE" />
          ) : (
            <Sun color="#78716C" size={18} />
          )}
          <Text style={tab === 'today' ? styles.tabTextTodayActive : styles.tabTextIdle}>Today’s Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabPill, tab === 'new' ? styles.tabPillNewActive : styles.tabPillIdle]}
          onPress={() => setTab('new')}
          activeOpacity={0.92}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'new' }}
        >
          <Sparkles color={tab === 'new' ? '#78350F' : '#57534E'} size={18} />
          <Text style={tab === 'new' ? styles.tabTextNewActive : styles.tabTextIdle}>New quotes</Text>
        </TouchableOpacity>
      </View>
    </DreamyHomeBackground>
  );
}

const styles = StyleSheet.create({
  topSafe: {
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  favoritesHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    shadowColor: '#7C2D12',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  favoritesHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B91C1C',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleMain: {
    textAlign: 'center',
  },
  titleDaily: {
    fontSize: 34,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(251, 191, 36, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleQuotes: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textShadowColor: 'rgba(147, 197, 253, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(30, 58, 95, 0.75)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  scrollContentWithBar: {
    paddingBottom: 12,
  },
  loading: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginHorizontal: 20,
    marginTop: 24,
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyNew: {
    marginHorizontal: 24,
    marginTop: 32,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    alignItems: 'center',
  },
  emptyNewEmoji: {
    fontSize: 36,
    marginBottom: 12,
    color: '#F59E0B',
  },
  emptyNewTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyNewBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  anotherQuoteBar: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 34,
  },
  anotherQuoteError: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  anotherQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 88, 12, 0.35)',
    shadowColor: '#B45309',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  anotherQuoteBtnDisabled: {
    opacity: 0.65,
  },
  anotherQuoteBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
  },
  openDrawerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  openDrawerBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
  },
  bottomTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 248, 240, 0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(251, 191, 36, 0.35)',
  },
  tabPill: {
    flex: 1,
    maxWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  tabPillIdle: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(120, 113, 108, 0.2)',
  },
  tabPillTodayActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#93C5FD',
    shadowColor: '#2563EB',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tabPillNewActive: {
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: '#EA580C',
    shadowColor: '#B45309',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tabTextIdle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#57534E',
  },
  tabTextTodayActive: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  tabTextNewActive: {
    fontSize: 14,
    fontWeight: '900',
    color: '#78350F',
  },
});
