import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="PantallaHome" />
      <Stack.Screen name="PantallaInicio" />
      <Stack.Screen name="PantallaRegistro" />
    </Stack>
  );
}