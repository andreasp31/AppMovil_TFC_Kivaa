import { Platform } from 'react-native';

const kivaaAmarillo = '#FAD934';
const kivaaOscuro = '#212121';
const kivaaGris = '#E3E3E3' 

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: kivaaAmarillo,
    icon: '#687076',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: kivaaAmarillo,
    primary: kivaaAmarillo,
    secondary: kivaaGris
  },
  dark: {
    text: '#FFFFFF',
    background: kivaaOscuro,
    tint: kivaaAmarillo,
    icon: '#9BA1A6',
    tabIconDefault: '#687076',
    tabIconSelected: kivaaAmarillo,
    primary: kivaaAmarillo,
    secondary: '#333333',
  },
};

export const Fonts = {
  bold: 'Outfit-Bold', // títulos
  regular: 'Inter-Regular', // textos
};
