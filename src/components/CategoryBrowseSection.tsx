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
  const n = selected.length;
  const total = QUOTE_CATEGORIES.length;

  return (
    <View style={styles.section}>
      <View style={styles.eyebrowRow}>
        <LinearGradient
          colors={['#FB923C', '#F472B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.eyebrowAccent}
        />
        <Text style={styles.eyebrowText}>Categories</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{total}</Text>
        </View>
      </View>

      <View
        style={[styles.statusPill, n === 0 ? styles.statusPillIdle : styles.statusPillActive]}
        accessible
        accessibilityLabel={
          n > 0
            ? `${n} theme${n === 1 ? '' : 's'} selected`
            : 'No themes selected'
        }
      >
        {n > 0 ? (
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(236, 253, 245, 0.98)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ) : null}
        <Sparkles
          color={n > 0 ? '#059669' : '#94A3B8'}
          size={16}
          strokeWidth={2.2}
        />
        <Text style={[styles.statusText, n === 0 && styles.statusTextIdle]}>
          {n > 0 ? `${n} selected` : 'Pick below'}
        </Text>
      </View>

      <View style={styles.chipWrap}>
        {QUOTE_CATEGORIES.map((cat) => {
          const active = selected.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onToggleCategory(cat)}
              style={[styles.chipOuter, active && styles.chipOuterActive]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: active }}
              accessibilityLabel={`${formatCategoryLabel(cat)} category`}
              activeOpacity={0.88}
            >
              {active ? (
                <LinearGradient
                  colors={['#FFAD72', '#FBBF24', '#F59E0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.chipFill}
                >
                  <Text style={styles.chipTextActive}>{formatCategoryLabel(cat)}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.chipInactiveInner}>
                  <Text style={styles.chipText}>{formatCategoryLabel(cat)}</Text>
                </View>
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
          accessibilityLabel={
            disabledLoad
              ? 'Select at least one theme to load a quote'
              : 'Load a random quote matching all selected themes'
          }
          activeOpacity={0.92}
        >
          <LinearGradient
            colors={
              disabledLoad || loading
                ? ['#E8E8EA', '#D4D4D8']
                : ['#FDE68A', '#F59E0B', '#EA580C']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            {loading ? (
              <ActivityIndicator color="#431407" />
            ) : (
              <View style={styles.primaryInner}>
                <Sparkles color={disabledLoad ? '#71717A' : '#431407'} size={20} strokeWidth={2.2} />
                <Text style={[styles.primaryButtonText, disabledLoad && styles.primaryButtonTextDisabled]}>
                  {disabledLoad ? 'Select themes' : 'Load a quote'}
                </Text>
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
            <Text style={styles.clearButtonText}>Clear all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  eyebrowAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  eyebrowText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#1E3A5F',
    letterSpacing: -0.3,
  },
  countBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  statusPillIdle: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  statusPillActive: {
    borderColor: 'rgba(5, 150, 105, 0.35)',
    shadowColor: '#059669',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
    letterSpacing: 0.2,
  },
  statusTextIdle: {
    color: '#64748B',
    fontWeight: '800',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  chipOuterActive: {
    borderWidth: 0,
    shadowColor: '#EA580C',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  chipFill: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipInactiveInner: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.15,
  },
  chipTextActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#431407',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 2,
  },
  actions: {
    marginTop: 22,
    gap: 14,
  },
  primaryTouch: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(234, 88, 12, 0.65)',
    shadowColor: '#C2410C',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  primaryTouchDisabled: {
    opacity: 0.6,
    borderColor: 'rgba(113, 113, 122, 0.4)',
    shadowOpacity: 0.08,
    elevation: 2,
  },
  primaryGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    minHeight: 56,
  },
  primaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: '#431407',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  primaryButtonTextDisabled: {
    color: '#52525B',
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.45)',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.2,
  },
});
