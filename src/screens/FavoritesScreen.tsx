import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react-native';
import { useFavorites } from '../hooks/useFavorites';
import type { Quote } from '../types/quote';
import { DreamyHomeBackground } from '../components/home/DreamyHomeBackground';
import { WhimsicalQuoteCard } from '../components/home/WhimsicalQuoteCard';
import type { RootStackParamList } from '../navigation/types';

function buildShareMessage(quote: Quote) {
  return quote.author ? `${quote.text}\n- ${quote.author}` : quote.text;
}

export function FavoritesScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Favorites'>) {
  const insets = useSafeAreaInsets();
  const { favorites, loading, isFavorited, toggleFavorite } = useFavorites();

  const onShare = useCallback(async (quote: Quote) => {
    try {
      await Share.share({ message: buildShareMessage(quote) });
    } catch {
      // Ignore share failures (user cancelled, etc.).
    }
  }, []);

  return (
    <DreamyHomeBackground>
      <View style={[styles.topSafe, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backPill}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.9}
          >
            <ArrowLeft color="#2563EB" size={22} strokeWidth={2.4} />
          </TouchableOpacity>
          <View style={styles.countBadge}>
            <Heart color="#DC2626" size={16} fill="#FECACA" />
            <Text style={styles.countBadgeText}>{favorites.length}</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.titleIcons}>
            <Heart color="#F472B6" size={22} fill="#FBCFE8" />
          </View>
          <Text style={styles.titleMain} accessibilityRole="header">
            <Text style={styles.titleYour}>Your </Text>
            <Text style={styles.titleFavorites}>Favorites</Text>
          </Text>
          <View style={styles.titleIcons}>
            <Sparkles color="#FBBF24" size={20} />
          </View>
        </View>
        <Text style={styles.subtitle}>
          {loading
            ? 'Gathering your saved words…'
            : favorites.length === 0
              ? 'Hearts you tap live here'
              : `${favorites.length} beautiful quote${favorites.length === 1 ? '' : 's'} tucked away`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#EA580C" size="large" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>♥</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyBody}>
              When a quote speaks to you, tap the heart on the home screen. It’ll show up here — same cozy
              design, ready whenever you are.
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.goBack()} activeOpacity={0.9}>
              <Sparkles color="#78350F" size={18} />
              <Text style={styles.emptyBtnText}>Back to quotes</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={FavoriteListSeparator}
          renderItem={({ item }) => (
            <WhimsicalQuoteCard
              quote={item}
              isFavorite={isFavorited(item)}
              onToggleFavorite={() => toggleFavorite(item)}
              onShare={() => onShare(item)}
            />
          )}
        />
      )}
    </DreamyHomeBackground>
  );
}

const styles = StyleSheet.create({
  topSafe: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backPill: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  countBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#B91C1C',
    minWidth: 20,
    textAlign: 'center',
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
  },
  titleMain: {
    textAlign: 'center',
  },
  titleYour: {
    fontSize: 32,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(251, 191, 36, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleFavorites: {
    fontSize: 32,
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
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(30, 58, 95, 0.78)',
  },
  loading: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  emptyCard: {
    padding: 26,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
    color: '#F472B6',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 22,
  },
  emptyBtn: {
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
  emptyBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
  },
  separator: {
    height: 4,
  },
});

function FavoriteListSeparator() {
  return <View style={styles.separator} />;
}
