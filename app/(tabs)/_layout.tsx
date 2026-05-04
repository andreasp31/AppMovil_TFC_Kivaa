import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { Map, Heart, MessageSquare, User } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Image, View, StyleSheet, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FAD934', 
        tabBarInactiveTintColor: '#ffffffff',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffffff', 
          borderWidth: 1,
          borderColor:"#212121",
          height: 60,
          margin:15,
          borderRadius:80,
          paddingTop:10,
          elevation:0,
          shadowOpacity: 0,
          position: 'absolute',

        },
        headerShown: false, // Para que no salga el título arriba
      }}>
      <Tabs.Screen
        name="PantallaFavoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconoContenedor, 
              focused && styles.iconoContenedorActivo1
            ]}>
            <Image 
              source={require('../../assets/images/logoFavoritos.png')} 
              style={{ 
                paddingTop:  focused ? 10 : 0,
                width: focused ? 20 : 30, 
                height: focused ? 20 : 30,
              }} 
            />
            {focused && <Text style={styles.textoActivado}>Favoritos</Text>}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="PantallaPrincipal"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconoContenedor, 
              focused && styles.iconoContenedorActivo
            ]}>
              <Image 
                source={require('../../assets/images/logoPrincipal.png')} 
                style={{ 
                  paddingTop:  focused ? 10 : 0,
                  width: focused ? 20 : 30, 
                  height: focused ? 20 : 30, 
                }} 
              />
              {focused && <Text style={styles.textoActivado}>Home</Text>}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="PantallaResena"
        options={{
          title: 'Opiniones',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconoContenedor, 
              focused && styles.iconoContenedorActivo2
            ]}>
            <Image 
              source={require('../../assets/images/logoResenat.png')} 
              style={{ 
                paddingTop:  focused ? 10 : 0,
                width: focused ? 20 : 30, 
                height: focused ? 20 : 30,  
              }} 
            />
            {focused && <Text style={styles.textoActivado}>Reseñas</Text>}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="PantallaRegistro"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="PantallaInicio"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="PantallaHome"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="PantallaPerfil"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconoContenedor:{
    display:"flex",
    flexDirection:"row",
    gap:10,
    width:40,
    alignItems:"center",
    justifyContent:"center"
  },
  iconoContenedorActivo:{
    backgroundColor: '#FAD934',
    width:120,
    borderRadius:20,
    height:40
  },
  iconoContenedorActivo1:{
    backgroundColor: '#FAD934',
    width:120,
    borderRadius:20,
    height:40,
    marginLeft:20
  },
  iconoContenedorActivo2:{
    backgroundColor: '#FAD934',
    width:120,
    borderRadius:20,
    height:40,
    marginRight:20
  },
  textoActivado:{
    fontWeight:"bold"
  }
})