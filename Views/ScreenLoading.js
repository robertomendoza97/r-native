import React from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';

const ScreenLoading = () => {
  return (
    <View style={styles.contScreenLoading}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={styles.textLoading}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  contScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLoading: {
    fontSize: 24,
    color: '#000',
  },
});

export default ScreenLoading;
