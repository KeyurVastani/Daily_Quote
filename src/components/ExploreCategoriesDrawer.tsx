import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Compass, Sparkles, X } from 'lucide-react-native';
import { usePersistedCategorySelection } from '../hooks/usePersistedCategorySelection';
import { CategoryBrowseSection } from './CategoryBrowseSection';
import { fetchRandomQuoteByCategories } from '../api/quotesApi';
import type { Quote } from '../types/quote';

const WINDOW_W = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(WINDOW_W * 0.9, 360);

const DECOR = ['✦', '✧', '★', '✿', '˚'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onQuoteLoaded: (quote: Quote) => void;
};

export function ExploreCategoriesDrawer({ visible, onClose, onQuoteLoaded }: Props) {
  const { selected, toggle, clear, hydrated } = usePersistedCategorySelection();
  const [rendered, setRendered] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      setLoadError(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!rendered) return;
    if (visible) {
      progress.setValue(0);
      Animated.spring(progress, {
        toValue: 1,
        useNativeDriver: true,
        friction: 9,
        tension: 65,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }
  }, [visible, rendered, progress]);

  const loadQuote = useCallback(async () => {
    if (selected.length === 0) return;
    try {
      setLoading(true);
      setLoadError(null);
      const apiQuote = await fetchRandomQuoteByCategories(selected);
      const q: Quote = {
        id: `cat:${Date.now()}`,
        text: apiQuote.quote,
        author: apiQuote.author,
        work: apiQuote.work,
        categories: apiQuote.categories,
      };
      onQuoteLoaded(q);
      onClose();
    } catch {
      setLoadError('Could not load a quote. Try again or change your selection.');
    } finally {
      setLoading(false);
    }
  }, [selected, onQuoteLoaded, onClose]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  if (!rendered) {
    return null;
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close drawer" />
        </Animated.View>

        <Animated.View
          style={[
            styles.panelOuter,
            {
              width: DRAWER_WIDTH,
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['#FFF0F7', '#EDE9FE', '#DBEAFE', '#FFF7ED']}
            locations={[0, 0.32, 0.62, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.45, y: 1 }}
            style={styles.panelGradient}
          >
            <View pointerEvents="none" style={styles.sparkleDecor}>
              {DECOR.map((ch, i) => (
                <Text key={i} style={[styles.sparkleChar, SPARKLE_STYLE[i % SPARKLE_STYLE.length]]}>
                  {ch}
                </Text>
              ))}
            </View>

            <SafeAreaView style={styles.safe} edges={['top', 'left', 'bottom']}>
              <View style={styles.panelHeader}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closePill}
                  accessibilityRole="button"
                  accessibilityLabel="Close categories"
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.98)', 'rgba(239, 246, 255, 0.95)']}
                    style={styles.closePillGradient}
                  >
                    <X color="#1D4ED8" size={21} strokeWidth={2.5} />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.headerCard}>
                  <View style={styles.headerIconRow}>
                    <View style={styles.headerIconBubble}>
                      <Compass color="#1D4ED8" size={20} strokeWidth={2.3} />
                    </View>
                    <View style={[styles.headerIconBubble, styles.headerIconBubbleAlt]}>
                      <Sparkles color="#D97706" size={18} strokeWidth={2.2} />
                    </View>
                  </View>
                  <Text style={styles.panelTitleMain} accessibilityRole="header">
                    <Text style={styles.titleExplore}>Discover </Text>
                    <Text style={styles.titleByTheme}>by category</Text>
                  </Text>
                  <View style={styles.subtitlePill}>
                    <Text style={styles.subtitlePillText}>Multi-select</Text>
                    <Text style={styles.subtitlePillDot}>·</Text>
                    <Text style={styles.subtitlePillText}>All themes apply</Text>
                  </View>
                </View>
              </View>

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {!hydrated ? (
                  <View style={styles.hydrate}>
                    <ActivityIndicator color="#EA580C" size="large" />
                    <Text style={styles.hydrateText}>Loading your saved picks…</Text>
                  </View>
                ) : (
                  <>
                    <CategoryBrowseSection
                      selected={selected}
                      onToggleCategory={toggle}
                      onClearSelection={clear}
                      onLoadQuote={loadQuote}
                      loading={loading}
                      disabledLoad={selected.length === 0}
                    />
                    {loadError ? (
                      <View style={styles.errorBox}>
                        <Text style={styles.loadError}>{loadError}</Text>
                      </View>
                    ) : null}
                  </>
                )}
              </ScrollView>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const SPARKLE_STYLE = [
  { top: 14, right: 18, fontSize: 13, opacity: 0.7 },
  { top: 72, left: 12, fontSize: 15, opacity: 0.55 },
  { top: 140, right: 10, fontSize: 12, opacity: 0.6 },
  { top: 220, left: 16, fontSize: 11, opacity: 0.5 },
  { top: 320, right: 20, fontSize: 14, opacity: 0.45 },
] as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3B2A5C',
  },
  panelOuter: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 24,
  },
  panelGradient: {
    flex: 1,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderRightWidth: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.75)',
  },
  sparkleDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  sparkleChar: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.92)',
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  safe: {
    flex: 1,
    zIndex: 1,
  },
  panelHeader: {
    paddingHorizontal: 14,
    paddingTop: 56,
    paddingBottom: 12,
    position: 'relative',
  },
  headerCard: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#6366F1',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  headerIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.15)',
    shadowColor: '#2563EB',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerIconBubbleAlt: {
    borderColor: 'rgba(245, 158, 11, 0.25)',
    shadowColor: '#EA580C',
  },
  panelTitleMain: {
    marginBottom: 12,
  },
  titleExplore: {
    fontSize: 28,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(251, 191, 36, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleByTheme: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1D4ED8',
    fontStyle: 'italic',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(147, 197, 253, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(30, 58, 95, 0.08)',
  },
  subtitlePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  subtitlePillDot: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  closePill: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  closePillGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hydrate: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  hydrateText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#57534E',
  },
  errorBox: {
    marginHorizontal: 14,
    marginTop: 8,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(254, 242, 242, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(248, 113, 113, 0.35)',
    shadowColor: '#DC2626',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  loadError: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
});
