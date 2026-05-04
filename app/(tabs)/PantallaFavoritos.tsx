import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FichaLocal {
  _id: string;
  nombre: string;
  descripcion: string;
  plazas: number;
  horarios: string[];
  fechaHora: string;
}

export default function HomeScreen() {
  //Para cambiar entre pantallas
  
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  /*const tarjeta = ({ item }:{item : FichaLocal}) => {
    const horaReserva = cargarHora(item);
    return(
      <View style={styles.tarjeta}>
        <View style={styles.tarjetaInfo}>
          <View style={styles.tarjetaCabecera}>
            <Text style={styles.tarjetaTitulo}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => abrirModal3(item)}>
              <Image source={require('@/assets/images/Edit.png')} contentFit="cover" style={styles.fotoEditar}></Image>
            </TouchableOpacity>
          </View>
          <Text style={styles.tarjetaDescripcion}>{item.descripcion}</Text>
          <Text style={styles.tarjetaDescripcion}>{formatearFecha(item.fechaHora)}</Text>
        </View>
      </View>
    ) 
  };*/

  useFocusEffect(
  useCallback(()=>{
    const nombreUsuario = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        if(nombre){
          setNombreUsuario(nombre);
        }
      }
      catch(error){
        console.error("Error al cargar el nombre", error);
      }
    };
    nombreUsuario();
  }, [])
)
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style= {styles.containerCabecera} onPress={() => router.push("/PantallaPerfil")}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
          <View style={styles.contenedorCuenta}>
            <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
            <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
          </View>
      </TouchableOpacity>
      <Text style={styles.titulos}>Mis Favoritos</Text>
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
  containerCabecera:{
    display:"flex",
    flexDirection:"row",
    gap:160,
    marginTop:60
  },
  contenedorCuenta:{
    display:"flex",
    flexDirection:"column",
    gap:5
  },
  contenedorIconos:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:4
  },
  containerMenu:{
    display:"flex",
    flexDirection:"row",
    gap:20,
    marginTop:20
  },
  textos:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start", 
    marginTop:20,
    textAlign:"left",
    color:"black",
    gap:5
  },
  miTextoBoton:{
    color:"#110501",
  },
  textoDescripcion: {
    textAlign: "center", 
    color:"#110501",     
    fontSize: 12,
    marginBottom: 5,    
  },
  textoDescripcion2: {
    textAlign: "center", 
    color:"#110501",     
    fontSize: 14,
    marginBottom: 5,    
  },
  icono:{
    height:50,
    width:50
  },
  foto: {
    marginLeft:-40,
    width: 150,
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
    fontSize: 25,
    alignSelf:"flex-start",
    marginLeft:35
  }
});
