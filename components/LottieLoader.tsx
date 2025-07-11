import React from 'react';
import LottieView from 'lottie-react-native';

type Props = {
  source: any;
  style?: object;
};

export default function LottieLoader({ source, style }: Props) {
  if (!source) return null;
  return (
    <LottieView
      source={source}
      autoPlay
      loop
      style={style || { width: 120, height: 120 }}
    />
  );
}
