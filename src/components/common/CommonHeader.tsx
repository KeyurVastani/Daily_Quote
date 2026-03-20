import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CommonHeader({
  title,
  subtitle,
  left,
  right,
}: {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 14 }]}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.side}>{left}</View>

          <View style={styles.center}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={[styles.side, styles.rightSide]}>{right}</View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    flexShrink: 0,
    marginBottom: 10,
  },
  card: {
    // backgroundColor: 'rgba(255,255,255,0.7)',
    // borderRadius: 20,
    // paddingHorizontal: 14,
    // paddingVertical: 12,
    // borderWidth: 1,
    // borderColor: 'rgba(17,24,39,0.06)',
    // shadowColor: '#0F172A',
    // shadowOpacity: 0.08,
    // shadowRadius: 14,
    // shadowOffset: { width: 0, height: 6 },
    // elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    minWidth: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});

