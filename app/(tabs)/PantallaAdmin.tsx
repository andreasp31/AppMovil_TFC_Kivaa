import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PantallaAdmin() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [numeroLocales, setNumeroLocales] = useState('');
  const [numeroUsuarios, setNumeroUsuarios] = useState('');
  const [modalNuevoLocal, setModalNuevoLocal] = useState(false);
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text

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
      <View style={styles.contenedorDatos}>
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo}>{numeroLocales}</Text>
          <Text style={styles.textoDescripcion}>Locales Totales</Text>
        </View> 
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo}>{numeroUsuarios}</Text>
          <Text style={styles.textoDescripcion}>Usuarios Totales</Text>
        </View>
      </View>
      <Text>Menu</Text>
      <View style={styles.contenedorGeneral}>
        <TouchableOpacity  style={styles.contenedorInfo}>
          <Image></Image>
          <View style={styles.contenedorTexto}>
            <Text>Añadir Local</Text>
            <Text>Crear un nuevo establecimiento para la comunidad celíaca</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo}>
          <Image></Image>
          <View style={styles.contenedorTexto}>
            <Text>Editar Local</Text>
            <Text>Modificar la información de cualquier local</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo}>
          <Image></Image>
          <View style={styles.contenedorTexto}>
            <Text>Borrar Local</Text>
            <Text>Eliminar establecimiento por inactividad o cierre</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo}>
          <Image></Image>
          <View style={styles.contenedorTexto}>
            <Text>Borrar Reseñas</Text>
            <Text>Eliminar comentarios maliciosos</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal>

      </Modal>
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
  contenedorTexto:{
    display:"flex",
    flexDirection:"column"
  },
  contenedorGeneral:{
    display:"flex",
    flexDirection:"column",
    gap:10
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
  contenedorDatos:{
    display:"flex",
    flexDirection:"row",
    gap:30
  },
  contenedorInfo:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start"
  },
  datosInfo:{
    fontSize:20,
    fontWeight:700
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
