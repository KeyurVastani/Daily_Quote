import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';
import type { Quote } from '../types/quote';
import { Copy, CopyCheck, Heart, HeartOff, Share2 } from 'lucide-react-native';

const ACTION_ICON_SIZE = 16;

export function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onShare,
}: {
  quote: Quote;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const saveIconScale = useRef(new Animated.Value(1)).current;
  const [isCopied, setIsCopied] = useState(false);
  const chips = useMemo(() => {
    const list: string[] = [];
    if (quote.work) list.push(quote.work);
    if (quote.categories?.length) list.push(...quote.categories.slice(0, 2));
    // Deduplicate while preserving order.
    return [...new Set(list)].filter(Boolean);
  }, [quote.categories, quote.work]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  useEffect(() => {
    if (!onToggleFavorite) return;

    if (isFavorite) {
      Animated.sequence([
        Animated.timing(saveIconScale, {
          toValue: 1.25,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(saveIconScale, {
          toValue: 1,
          duration: 170,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      saveIconScale.setValue(1);
    }
  }, [isFavorite, onToggleFavorite, saveIconScale]);

  const copyText = () => {
    const message = quote.author ? `${quote.text}\n- ${quote.author}` : quote.text;
    Clipboard.setString(message);
    setIsCopied(true);
    // Reset quickly to keep the button feeling responsive.
    setTimeout(() => setIsCopied(false), 900);
  };

  return (
    <Animated.View
      style={[
        styles.outer,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient colors={['rgba(59,130,246,0.35)', 'rgba(236,72,153,0.25)']} style={styles.gradientBorder}>
        <View style={styles.cardInner}>
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteMark}>“</Text>
            <View style={styles.quoteBody}>
              <Text style={styles.quoteText}>{quote.text}</Text>
              {quote.author ? <Text style={styles.author}>— {quote.author}</Text> : null}
            </View>
          </View>

          {chips.length > 0 && (
            <View style={styles.metaRow}>
              {chips.map((c) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            {onToggleFavorite && (
              <TouchableOpacity
                onPress={onToggleFavorite}
                style={styles.saveButtonTouchable}
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? 'Unfavorite quote' : 'Favorite quote'}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={
                    isFavorite
                      ? ['rgba(190,24,93,0.95)', 'rgba(236,72,153,0.90)']
                      : ['rgba(17,24,39,0.06)', 'rgba(17,24,39,0.02)']
                  }
                  style={[
                    styles.iconActionButton,
                    isFavorite ? styles.saveButtonActive : styles.saveButtonInactive,
                  ]}
                >
                  <Animated.View style={{ transform: [{ scale: saveIconScale }] }}>
                    {isFavorite ? (
                      <Heart color="#FFFFFF" size={ACTION_ICON_SIZE} fill="#FFFFFF" />
                    ) : (
                      <Heart color="#DB2777" size={ACTION_ICON_SIZE} />
                    )}
                  </Animated.View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={copyText}
              style={styles.copyButtonTouchable}
              accessibilityRole="button"
              accessibilityLabel="Copy quote"
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={
                  isCopied
                    ? ['rgba(20,184,166,0.95)', 'rgba(59,130,246,0.65)']
                    : ['rgba(20,184,166,0.22)', 'rgba(59,130,246,0.14)']
                }
                style={styles.iconActionButton}
              >
                {isCopied ? (
                  <CopyCheck color="#FFFFFF" size={ACTION_ICON_SIZE} />
                ) : (
                  <Copy color="#0F172A" size={ACTION_ICON_SIZE} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {onShare && (
              <TouchableOpacity
                onPress={onShare}
                style={styles.shareButtonTouchable}
                accessibilityRole="button"
                accessibilityLabel="Share quote"
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['rgba(59,130,246,0.55)', 'rgba(37,99,235,0.88)']}
                  style={styles.iconActionButton}
                >
                  <Share2 color="#FFFFFF" size={ACTION_ICON_SIZE} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 1,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardInner: {
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quoteMark: {
    fontSize: 44,
    lineHeight: 44,
    marginRight: 8,
    color: 'rgba(37,99,235,0.35)',
    fontWeight: '900',
    marginTop: -2,
  },
  quoteBody: {
    flex: 1,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '900',
    color: '#0B1220',
    letterSpacing: 0.2,
  },
  author: {
    marginTop: 10,
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  chip: {
    backgroundColor: 'rgba(2,132,199,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonTouchable: {
    padding: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  iconActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 14,
  },
  saveButtonActive: {
    shadowColor: '#BE185D',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  saveButtonInactive: {
    borderWidth: 1,
    borderColor: 'rgba(190,24,93,0.18)',
  },
  shareButtonTouchable: {
    marginLeft: 10,
    padding: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  copyButtonTouchable: {
    padding: 0,
    borderRadius: 14,
    overflow: 'hidden',
    marginLeft: 10,
  },
});

