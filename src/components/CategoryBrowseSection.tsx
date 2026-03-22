import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { QUOTE_CATEGORIES, formatCategoryLabel } from '../constants/quoteCategories';

type Props = {
  selected: string[];
  onToggleCategory: (category: string) => void;
  onClearSelection: () => void;
  onLoadQuote: () => void;
  loading: boolean;
  disabledLoad: boolean;
};

export function CategoryBrowseSection({
  selected,
  onToggleCategory,
  onClearSelection,
  onLoadQuote,
  loading,
  disabledLoad,
}: Props) {
  return (
    <View style={styles.section}>
    

      <View style={styles.chipWrap}>
        {QUOTE_CATEGORIES.map((cat) => {
          const active = selected.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onToggleCategory(cat)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: active }}
              accessibilityLabel={`${formatCategoryLabel(cat)} category`}
              activeOpacity={0.85}
            >
              {active ? (
                <LinearGradient
                  colors={['#FDE68A', '#FBBF24']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.chipGradient}
                >
                  <Text style={styles.chipTextActive}>{formatCategoryLabel(cat)}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.chipText}>{formatCategoryLabel(cat)}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryTouch, (disabledLoad || loading) && styles.primaryTouchDisabled]}
          onPress={onLoadQuote}
          disabled={disabledLoad || loading}
          accessibilityRole="button"
          accessibilityLabel="Load a random quote for selected categories"
          activeOpacity={0.92}
        >
          <LinearGradient
            colors={
              disabledLoad || loading
                ? ['#E5E7EB', '#D1D5DB']
                : ['#FBBF24', '#F59E0B']
            }
            style={styles.primaryButton}
          >
            {loading ? (
              <ActivityIndicator color="#78350F" />
            ) : (
              <View style={styles.primaryRow}>
                <Sparkles color="#78350F" size={18} />
                <Text style={styles.primaryButtonText}>Load a quote</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {selected.length > 0 ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearSelection}
            accessibilityRole="button"
            accessibilityLabel="Clear category selection"
            activeOpacity={0.85}
          >
            <Text style={styles.clearButtonText}>Clear selection</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionHeader: {
    marginBottom: 18,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    flex: 1,
    flexWrap: 'wrap',
  },
  titlePick: {
    fontSize: 22,
    fontWeight: '800',
    color: '#EA580C',
    textShadowColor: 'rgba(251, 191, 36, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  titleThemes: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563EB',
    fontStyle: 'italic',
    textShadowColor: 'rgba(147, 197, 253, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sectionHint: {
    fontSize: 14,
    lineHeight: 21,
    color: '#475569',
    fontWeight: '600',
  },
  hintEmphasis: {
    fontWeight: '900',
    color: '#1D4ED8',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  chip: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    backgroundColor: 'rgba(255, 249, 240, 0.95)',
  },
  chipActive: {
    borderColor: '#EA580C',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  chipGradient: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#57534E',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipTextActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#78350F',
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  primaryTouch: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EA580C',
    shadowColor: '#B45309',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryTouchDisabled: {
    opacity: 0.55,
    borderColor: '#9CA3AF',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    minHeight: 52,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: '#78350F',
    fontSize: 16,
    fontWeight: '900',
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(180, 83, 9, 0.2)',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
});
