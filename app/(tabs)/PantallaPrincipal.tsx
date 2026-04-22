import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter, Stack} from 'expo-router';

export default function HomeScreen() {
  //Para cambiar entre pantallas
  const router = useRouter();
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.containerFotos}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
      </View>
      <View style={styles.textos}>
        <Text style={styles.titulos}>Todas tus comidas favoritas</Text>
        <Text style={styles.textoDescripcion}>Descubre nuevos sitios <Text style={styles.textoBold}>Sin Gluten</Text> cerca de ti!</Text>
      </View>
      <View style={styles.container2}>
        <KivaaBoton titulo="Iniciar Sesión" onPress={() => router.push("/PantallaInicio")}></KivaaBoton>
        <KivaaBoton titulo="Registrarse" type="secondary" onPress={() => router.push("/PantallaRegistro")}></KivaaBoton>
      </View>
    </View>  
  );
}

//estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "white",
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    marginTop:10
  },
  textos:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    marginLeft:30, 
    marginRight:30, 
    textAlign:"center",
    color:"black",
    gap:10
  },
  miTextoBoton:{
    color:"#110501",
  },
  textoDescripcion: {
    textAlign: "center", 
    color:"#110501",     
    fontSize: 14,
    marginBottom: 5,    
  },
  foto: {
    height: 100,
    width: 220,
    resizeMode: "contain"
  },
  foto2: {
    bottom: 0,            
    height: 340,
    width: 550,
    resizeMode: "contain",
  },
  textoBold:{
    fontWeight: 'bold'
  },
  containerFotos:{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 70
  },
  titulos:{
    fontWeight: 'bold',
    fontSize: 20
  }
});
