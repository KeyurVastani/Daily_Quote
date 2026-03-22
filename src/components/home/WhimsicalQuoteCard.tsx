import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';
import { Copy, CopyCheck, Heart, Share2, Sun } from 'lucide-react-native';
import type { Quote } from '../../types/quote';

const ICON = 16;

function quoteTokensWithHighlightIndex(text: string): { tokens: string[]; highlightIndex: number } {
  const tokens = text.split(/(\s+)/);
  let highlightIndex = -1;
  let bestLen = 0;
  tokens.forEach((t, i) => {
    const w = t.trim();
    if (w.length > bestLen && /^[a-zA-Z'-]+$/.test(w)) {
      bestLen = w.length;
      highlightIndex = i;
    }
  });
  return { tokens, highlightIndex };
}

type Props = {
  quote: Quote;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
};

export function WhimsicalQuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onShare,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const saveIconScale = useRef(new Animated.Value(1)).current;
  const [isCopied, setIsCopied] = useState(false);

  const chips = useMemo(() => {
    const list: string[] = [];
    if (quote.work) list.push(quote.work);
    if (quote.categories?.length) list.push(...quote.categories.slice(0, 2));
    return [...new Set(list)].filter(Boolean);
  }, [quote.categories, quote.work]);

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 380, useNativeDriver: true }).start();
  }, [anim]);

  useEffect(() => {
    if (!onToggleFavorite) return;
    if (isFavorite) {
      Animated.sequence([
        Animated.timing(saveIconScale, { toValue: 1.22, duration: 140, useNativeDriver: true }),
        Animated.timing(saveIconScale, { toValue: 1, duration: 170, useNativeDriver: true }),
      ]).start();
    } else {
      saveIconScale.setValue(1);
    }
  }, [isFavorite, onToggleFavorite, saveIconScale]);

  const copyText = () => {
    const message = quote.author ? `${quote.text}\n- ${quote.author}` : quote.text;
    Clipboard.setString(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 900);
  };

  const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: undefined });
  const scriptAuthor = Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: undefined,
  });

  const { tokens, highlightIndex } = quoteTokensWithHighlightIndex(quote.text);

  return (
    <Animated.View
      style={[
        styles.outer,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }),
            },
          ],
        },
      ]}
    >
      <View style={styles.goldFrame}>
        <View style={styles.cardInner}>
          <View style={styles.sunRow}>
            <Sun color="#F59E0B" size={28} fill="#FCD34D" strokeWidth={1.8} />
          </View>

          <View style={styles.quoteRow}>
            <Text style={styles.bigQuoteOpen}>“</Text>
            <View style={styles.bodyCol}>
              <Text style={[styles.quoteTextBlock, serif ? { fontFamily: serif } : null]}>
                {tokens.map((t, i) => (
                  <Text
                    key={`${i}-${t.slice(0, 12)}`}
                    style={[
                      i === highlightIndex ? styles.wordHighlight : styles.quotePlain,
                      serif ? { fontFamily: serif } : null,
                    ]}
                  >
                    {t}
                  </Text>
                ))}
              </Text>
              {quote.author ? (
                <Text
                  style={[styles.authorScript, scriptAuthor && { fontFamily: scriptAuthor }]}
                  numberOfLines={2}
                >
                  {quote.author}
                </Text>
              ) : null}
            </View>
          </View>

          {chips.length > 0 ? (
            <View style={styles.chipRow}>
              {chips.map((c) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.decoBottom}>
            <Text style={styles.miniStar}>★</Text>
            <Text style={styles.miniHeart}>♥</Text>
          </View>

          <View style={styles.actions}>
            {onToggleFavorite ? (
              <TouchableOpacity
                onPress={onToggleFavorite}
                style={styles.actTouch}
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? 'Unfavorite' : 'Favorite'}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={
                    isFavorite
                      ? ['#F472B6', '#EC4899']
                      : ['rgba(255,255,255,0.9)', 'rgba(255,250,240,0.95)']
                  }
                  style={[styles.actBtn, !isFavorite && styles.actBtnOutline]}
                >
                  <Animated.View style={{ transform: [{ scale: saveIconScale }] }}>
                    {isFavorite ? (
                      <Heart color="#FFFFFF" size={ICON} fill="#FFFFFF" />
                    ) : (
                      <Heart color="#E11D48" size={ICON} />
                    )}
                  </Animated.View>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity onPress={copyText} style={styles.actTouch} activeOpacity={0.9}>
              <LinearGradient
                colors={isCopied ? ['#34D399', '#10B981'] : ['#FEF3C7', '#FDE68A']}
                style={styles.actBtn}
              >
                {isCopied ? (
                  <CopyCheck color="#FFFFFF" size={ICON} />
                ) : (
                  <Copy color="#92400E" size={ICON} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {onShare ? (
              <TouchableOpacity onPress={onShare} style={styles.actTouch} activeOpacity={0.9}>
                <LinearGradient colors={['#93C5FD', '#3B82F6']} style={styles.actBtn}>
                  <Share2 color="#FFFFFF" size={ICON} />
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 18,
    marginTop: 6,
  },
  goldFrame: {
    borderRadius: 24,
    padding: 3,
    backgroundColor: '#FBBF24',
    shadowColor: '#B45309',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardInner: {
    borderRadius: 21,
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  sunRow: {
    alignItems: 'center',
    marginBottom: 6,
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bigQuoteOpen: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '900',
    color: '#EA580C',
    marginRight: 4,
    marginTop: -8,
  },
  bodyCol: {
    flex: 1,
    paddingTop: 4,
  },
  quoteTextBlock: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  quotePlain: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  wordHighlight: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '800',
    color: '#EA580C',
  },
  authorScript: {
    marginTop: 14,
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#2563EB',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  decoBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
    paddingRight: 4,
  },
  miniStar: {
    fontSize: 14,
    color: '#FBBF24',
  },
  miniHeart: {
    fontSize: 13,
    color: '#FBBF24',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },
  actTouch: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  actBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actBtnOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(225, 29, 72, 0.25)',
  },
});
