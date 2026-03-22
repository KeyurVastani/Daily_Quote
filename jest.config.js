module.exports = {
  preset: 'react-native',
  // @react-navigation ships ESM; Jest must transform it
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-linear-gradient|react-native-svg|lucide-react-native)/)',
  ],
};
