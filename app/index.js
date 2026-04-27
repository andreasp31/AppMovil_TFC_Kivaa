import { Redirect } from 'expo-router';

export default function Index() {
  // Aquí si hay un Token con AsyncStorage
  const usuarioLogueado = false; 

  if (!usuarioLogueado) {
    // Si no está logueado, se manda a la pantalla de Inicio/Login
    return <Redirect href="/PantallaHome" />;
  }
  // Si está logueado, se manda a las pestañas
  return <Redirect href="/PantallaPrincipal" />;
}