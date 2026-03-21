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
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { usePersistedCategorySelection } from '../hooks/usePersistedCategorySelection';
import { CategoryBrowseSection } from './CategoryBrowseSection';
import { fetchRandomQuoteByCategories } from '../api/quotesApi';
import type { Quote } from '../types/quote';

const WINDOW_W = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(WINDOW_W * 0.9, 360);

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
    outputRange: [0, 0.4],
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
            styles.panel,
            {
              width: DRAWER_WIDTH,
              transform: [{ translateX }],
            },
          ]}
        >
          <SafeAreaView style={styles.safe} edges={['top', 'left', 'bottom']}>
            <View style={styles.panelHeader}>
              <View style={styles.panelHeaderText}>
                <Text style={styles.panelTitle}>Explore</Text>
                <Text style={styles.panelSubtitle}>Categories</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Close categories"
              >
                <X color="#64748B" size={24} strokeWidth={2.2} />
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
                  <ActivityIndicator />
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
                  {loadError ? <Text style={styles.loadError}>{loadError}</Text> : null}
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 16,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  safe: {
    flex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15, 23, 42, 0.08)',
  },
  panelHeaderText: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  panelSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  closeBtn: {
    padding: 8,
    marginRight: -4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  hydrate: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadError: {
    marginHorizontal: 16,
    marginTop: 8,
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
