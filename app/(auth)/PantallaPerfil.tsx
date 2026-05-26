import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PantallaPerfil() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [apellidosUsuario, setApellidosUsuario] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [claveUsuario, setClaveUsuario] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
  useCallback(()=>{
    const datosUsuario = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const apellidos = await AsyncStorage.getItem("apellidosUsuario");
        const correo = await AsyncStorage.getItem("emailUsuario");
        const clave = await AsyncStorage.getItem("claveUsuario");
        if(nombre){
          setNombreUsuario(nombre);
        }
        if(apellidos){
          setApellidosUsuario(apellidos)
        }
        if(correo){
          const posicionArroba = correo.indexOf("@");
          const nombreCortado = correo.substring(0,2);
          const dominio = correo.substring(posicionArroba);
          const correoFinal =  nombreCortado + "****" + dominio;
          setCorreoUsuario(correoFinal);
        }
        if(clave){
          setClaveUsuario("*******");
        }
        else setApellidosUsuario("No encontrado");
      }
      catch(error){
        console.error("Error al cargar el datos", error);
      }
    };
    datosUsuario();
  }, [])
)
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style= {styles.containerCabecera}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <TouchableOpacity style={styles.contenedorSalir} onPress={() => setModalVisible(true)}>
          <Image source={require('@/assets/images/LogOut.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>Salir</Text>
        </TouchableOpacity>
      </View>
      <View style = {styles.contenedorTexto}>
        <Text style={styles.titulos}>Mi Cuenta</Text>
        <Text style={styles.textoDescripcion2}>Modifica los datos de tu perfil</Text>
      </View>
      <View style = {styles.bloquePrincipal}>
        <View style = {styles.contenedorSuperior}>
          <View style = {styles.bloqueFoto}>
            <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
            <Image source={require('@/assets/images/iconoPerfil.png')} style={styles.iconoFoto}></Image>
          </View>
          <View style = {styles.contenedorBloque}>
            <View style = {styles.contenedorApartado}>
              <View style = {styles.contenedorTextos}>
                <Text>Nombre</Text>
                <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
              </View>
              <Text style={styles.titulos}>{nombreUsuario}</Text>
            </View>
            <View style = {styles.contenedorApartado}>
              <View style = {styles.contenedorTextos}>
                <Text>Apellidos</Text>
                <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
              </View>
              <Text style={styles.titulos}>{apellidosUsuario}</Text>
            </View>
          </View>
        </View>
        <View style = {styles.contenedorInferior}>
          <View style = {styles.contenedorApartado}>
            <View style = {styles.contenedorTextos}>
              <Text>Correo</Text>
              <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
            </View>
            <Text>{correoUsuario}</Text>
          </View>
          <View style = {styles.contenedorApartado}>
            <View style = {styles.contenedorTextos}>
              <Text>Contraseña</Text>
              <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
            </View>
            <Text>{claveUsuario}</Text>
          </View>
        </View>
      </View>
      <View style = {styles.contenedorBotones}>
        <TouchableOpacity style = {styles.Boton1}>
          <Text>Eliminar Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.Boton2}>
          <Text>Actualizar</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        transparent={true}>
          <View style={styles.modalFondo}>
            <View style={styles.modalBloque}>
              <Text style={styles.titulos}>Cerrar Sesión</Text>
              <Text>¿Estás seguro de que quieres cerrar sesión?</Text>
              <View style = {styles.contenedorBotones2}>
                <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible(false)}>
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
    alignItems: "center",
    marginTop:10
  },
  Boton1:{
    borderWidth:1,
    paddingHorizontal:25,
    paddingVertical:10,
    borderRadius:30
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
  Boton2:{
    paddingHorizontal:45,
    paddingVertical:10,
    borderRadius:30,
    backgroundColor:"#FAD934"
  },
  contenedorBloque:{
    display:"flex",
    flexDirection:"column",
    gap:15
  },
  bloquePrincipal:{
    marginTop:20
  },
  contenedorSuperior:{
    display:"flex",
    flexDirection:"row",
    gap:20
  },
  contenedorBotones:{
    display:"flex",
    flexDirection:"row",
    marginTop:250,
    gap:40
  },
  contenedorBotones2:{
    display:"flex",
    flexDirection:"row",
    marginTop:20,
    gap:55
  },
  contenedorInferior:{
    display:"flex",
    flexDirection:"row",
    gap:40,
    marginTop:30
  },
  contenedorTextos:{
    display:"flex",
    flexDirection:"row",
    gap:10
  },
  contenedorApartado:{
    display:"flex",
    flexDirection:"column",
    gap:5
  },
  containerCabecera:{
    display:"flex",
    flexDirection:"row",
    gap:120,
    marginTop:60,
    alignItems:"center"
  },
  contenedorTexto:{
    display:"flex",
    flexDirection:"column",
    alignSelf:"flex-start",
    marginLeft:40
  },
  contenedorSalir:{
    display:"flex",
    flexDirection:"row",
    gap:7,
    borderWidth:1,
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:20,
    alignContent:"center",
    height:35
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
  bloqueFoto:{
    display:"flex",
    flexDirection:"column",
  },
  iconoFoto:{
    width:100,
    height:100
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
    textAlign:"left",
    color:"#110501",     
    fontSize: 16,    
  },
  textoDescripcion2: {
    textAlign: "center", 
    color:"#110501",     
    fontSize: 14,
    marginBottom: 5,    
  },
  icono:{
    height:20,
    width:20
  },
  iconoEditar:{
    height:15,
    width:15
  },
  foto: {
    marginLeft:-40,
    width: 150,
    height:75,
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
  }
});