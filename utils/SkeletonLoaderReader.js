import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonLoaderReader = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerEffect = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerEffect.start();

    return () => shimmerEffect.stop();
  }, [shimmerAnimation]);

  const interpolateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width * 2],
  });

  return (
    <View style={styles.container}>
      {/* Skeleton for Header */}
      <View style={styles.header} />

      {/* Skeleton for content area */}
      <View style={styles.content}>
        {/* <View style={styles.imagePlaceholder} /> */}
        <View style={styles.textPlaceholder} />
        <View style={styles.textPlaceholder} />
        <View style={styles.textPlaceholder} />
      </View>
      <View style={styles.header} />

{/* Skeleton for content area */}
<View style={styles.content}>
  {/* <View style={styles.imagePlaceholder} /> */}
  <View style={styles.textPlaceholder} />
  <View style={styles.textPlaceholder} />
  <View style={styles.textPlaceholder} />
</View>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: interpolateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  header: {
    width: width,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: width * 0.9,
    padding: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
  },
  textPlaceholder: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 2,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
});

export default SkeletonLoaderReader;
