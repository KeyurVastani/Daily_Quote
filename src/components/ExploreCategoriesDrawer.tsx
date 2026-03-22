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

const DECOR = ['✦', '✧', '★'];

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
            colors={['#FFE8F3', '#F0E6FF', '#E5F3FF', '#FFF4E6']}
            locations={[0, 0.35, 0.65, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
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
                <View style={styles.panelHeaderLeft}>
                  <View style={styles.headerIconRow}>
                    <Compass color="#2563EB" size={22} strokeWidth={2.2} />
                    <Sparkles color="#FBBF24" size={20} />
                  </View>
                  <Text style={styles.panelTitleMain} accessibilityRole="header">
                    <Text style={styles.titleExplore}>Discover </Text>
                    <Text style={styles.titleByTheme}>by category</Text>
                  </Text>
                  <Text style={styles.panelSubtitle}>
                    Choose topics that match your mood — we’ll find a quote that fits{' '}
                    <Text style={styles.subtitleEmphasis}>all</Text> of them at once.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closePill}
                  accessibilityRole="button"
                  accessibilityLabel="Close categories"
                  activeOpacity={0.88}
                >
                  <X color="#2563EB" size={22} strokeWidth={2.4} />
                </TouchableOpacity>
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
  { top: 12, right: 14, fontSize: 12, opacity: 0.65 },
  { top: 88, left: 10, fontSize: 14, opacity: 0.5 },
  { top: 160, right: 8, fontSize: 11, opacity: 0.55 },
] as const;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#5B3A6E',
  },
  panelOuter: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
    shadowColor: '#7C2D12',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 20,
  },
  panelGradient: {
    flex: 1,
    borderTopRightRadius: 26,
    borderBottomRightRadius: 26,
    borderRightWidth: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.85)',
  },
  sparkleDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  sparkleChar: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(251, 191, 36, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  safe: {
    flex: 1,
    zIndex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251, 191, 36, 0.35)',
  },
  panelHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  panelTitleMain: {
    marginBottom: 6,
    marginTop: 10,
  },
  titleExplore: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EA580C',
    textShadowColor: 'rgba(251, 191, 36, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  titleByTheme: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2563EB',
    fontStyle: 'italic',
    textShadowColor: 'rgba(147, 197, 253, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  panelSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(30, 58, 95, 0.78)',
    lineHeight: 21,
  },
  subtitleEmphasis: {
    fontWeight: '900',
    color: '#1D4ED8',
  },
  closePill: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.22)',
    marginTop: 2,
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
    marginHorizontal: 16,
    marginTop: 4,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(254, 226, 226, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
  },
  loadError: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
});
