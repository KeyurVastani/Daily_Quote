import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHint}>
          Pick one or more — quotes match all selected categories. Tap “Load a quote” again anytime for
          another random match.
        </Text>
      </View>

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
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {formatCategoryLabel(cat)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryButton, (disabledLoad || loading) && styles.primaryButtonDisabled]}
          onPress={onLoadQuote}
          disabled={disabledLoad || loading}
          accessibilityRole="button"
          accessibilityLabel="Load a random quote for selected categories"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Load a quote</Text>
          )}
        </TouchableOpacity>

        {selected.length > 0 ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearSelection}
            accessibilityRole="button"
            accessibilityLabel="Clear category selection"
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
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  sectionHint: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    lineHeight: 18,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  chipActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
    borderColor: 'rgba(37, 99, 235, 0.45)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  chipTextActive: {
    color: '#1D4ED8',
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
