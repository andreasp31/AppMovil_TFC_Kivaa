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
        tabBarInactiveTintColor: '#9BA1A6',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF', 
          borderWidth: 1,
          borderColor:"#212121",
          height: 60,
          margin:15,
          borderRadius:80,
          paddingTop:10
        },
        headerShown: false, // Para que no salga el título arriba
      }}>
      <Tabs.Screen
        name="PantallaFavoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/images/logoFavoritos.png')} 
              style={{ 
                width: 30,
                height: 30, 
                resizeMode: 'contain' 
              }} 
            />
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
            <Image 
              source={require('../../assets/images/logoResenat.png')} 
              style={{ 
                width: 30,
                height: 30, 
                resizeMode: 'contain' 
              }} 
            />
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
  textoActivado:{
    fontWeight:"bold"
  }
})