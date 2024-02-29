import { Image, StyleSheet } from 'react-native';

const logo = require('../../../assets/logo.webp');

interface LogoProps {
  style?: any;
}
export const Logo = ({ style }: LogoProps) => {
  return (
    <Image
      source={logo}
      style={[styles.logo, style]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 180,
  },
});