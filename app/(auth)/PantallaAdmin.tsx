import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PantallaAdmin() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [numeroLocales, setNumeroLocales] = useState<number>(0);
  const [numeroUsuarios, setNumeroUsuarios] = useState<number>(0);
  const [modalNuevoLocal, setModalNuevoLocal] = useState(false);
  const [modalCerrarSesion, setCerrarSesion] = useState(false);
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text

  useEffect(()=>{
    const seleccionarEstadisticas = async()=>{
      try{
        const respuesta = await axios.get("http://10.0.2.2:3000/api/admin/estadisticas");
        setNumeroLocales(respuesta.data.locales);
        setNumeroUsuarios(respuesta.data.usuarios);
      }
      catch(error){
        console.error("Error al cargar estadísticas:", error);
      }
    }
    seleccionarEstadisticas();
  },[])


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
      <TouchableOpacity style= {styles.containerCabecera}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <TouchableOpacity style={styles.contenedorCuenta} onPress={() => setCerrarSesion(true)}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.contenedorDatos}>
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo2}>{numeroLocales}</Text>
          <Text style={styles.textoDescripcion}>Locales Activos</Text>
        </View> 
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo2}>{numeroUsuarios}</Text>
          <Text style={styles.textoDescripcion}>Total de Usuarios</Text>
        </View>
      </View>
      <Text>Menu</Text>
      <View style={styles.contenedorGeneral}>
        <TouchableOpacity  style={styles.contenedorInfo2}>
          <Image source={require('@/assets/images/nuevoLocal.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Añadir Local</Text>
            <Text>Crear un nuevo establecimiento</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo2}>
          <Image source={require('@/assets/images/editarLocal.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Editar Local</Text>
            <Text>Modificar cualquier información</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo2}>
          <Image source={require('@/assets/images/eliminarLocal.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Borrar Local</Text>
            <Text>Eliminar por inactividad o cierre</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo2} onPress={() => router.push("/PantallaAdResena")}>
          <Image source={require('@/assets/images/botonResena.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Borrar Reseñas</Text>
            <Text>Eliminar comentarios maliciosos</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal visible={modalCerrarSesion}
        onRequestClose={() => setCerrarSesion(false)}
        animationType="fade"
        transparent={true}>
          <View style={styles.modalFondo}>
            <View style={styles.modalBloque}>
              <Text style={styles.titulos}>Cerrar Sesión</Text>
              <Text>¿Estás seguro de que quieres cerrar sesión?</Text>
              <View style = {styles.contenedorBotones2}>
                <TouchableOpacity style = {styles.Boton1} onPress={() => setCerrarSesion(false)}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Boton2} onPress={() => router.push("/PantallaHome")}>
                  <Text>Salir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  fondoInfo:{
    backgroundColor:"#FAD934",
    width:400,
    height:60,
    marginTop:-50
  },
  iconos:{
    height:70,
    width:70
  },
  Boton1:{
    borderWidth:1,
    paddingHorizontal:25,
    paddingVertical:10,
    borderRadius:30
  },
  Boton2:{
    paddingHorizontal:45,
    paddingVertical:10,
    borderRadius:30,
    backgroundColor:"#FAD934"
  },
  modalFondo:{
    backgroundColor:"rgba(0,0,0,0.5)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  modalBloque:{
    backgroundColor:"#FFFFFF",
    padding:40,
    borderRadius:20,
    gap:10
  },
  contenedorBotones2:{
    display:"flex",
    flexDirection:"row",
    marginTop:20,
    gap:55
  },
  contenedorTexto:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center"
  },
  contenedorGeneral:{
    display:"flex",
    flexDirection:"column",
    gap:15,
    marginTop:15
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
    gap:20,
    marginTop:25,
    marginBottom:10
  },
  contenedorInfo:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start",
    borderRadius:20,
    borderWidth:0.5,
    paddingHorizontal:30,
    paddingVertical:10,
    backgroundColor:"#FFFFFF"
  },
  contenedorInfo2:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-start",
    borderRadius:20,
    borderWidth:0.5,
    gap:15,
    paddingRight:20,
    paddingLeft:15,
    paddingVertical:15,
    backgroundColor:"#FFFFFF"
  },
  datosInfo:{
    fontSize:16,
    fontWeight:700
  },
  datosInfo2:{
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
