import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text, Modal, TextInput } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  role: string;
  clave: string;
}

export default function PantallaPerfil() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [apellidosUsuario, setApellidosUsuario] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [claveUsuario, setClaveUsuario] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [nombreEditar, setNombreEditar] = useState('');
  const [apellidosEditar, setApellidosEditar] = useState('');
  const [correoEditar, setCorreoEditar] = useState('');
  const [claveEditar, setClaveEditar] = useState('');
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [alertaBorrar, setAlertaBorrar] = useState(false);
  const [usuarioSeleccionada, setUsuarioSeleccionada] = useState<Usuario | null>(null);

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
);

const actualizarPerfil = async () => {
  try{
    const usuarioId = await AsyncStorage.getItem("idUsuario");
    await AsyncStorage.setItem("nombreUsuario", nombreEditar);
    await AsyncStorage.setItem("apellidosUsuario", apellidosEditar);
    await AsyncStorage.setItem("emailUsuario", correoEditar);
    await AsyncStorage.setItem("claveUsuario", claveEditar);

    setNombreUsuario(nombreEditar);
    setApellidosUsuario(apellidosEditar);

    const posicionArroba = correoEditar.indexOf("@");
    const nombreCortado = correoEditar.substring(0, 2);
    const dominio = correoEditar.substring(posicionArroba);
    setCorreoUsuario(nombreCortado + "****" + dominio);
    setClaveUsuario("*******");

    setModalVisible2(false);
    alert("Perfil actualizado correctamente");
  }
  catch(error){
    console.error("Error al actualizar el perfil", error);
    alert("Hubo un error al guardar los cambios");
  }
};

const borrarUsuario = async() => {
  try{
    const usuarioId = await AsyncStorage.getItem("idUsuario");
    if (!usuarioId) {
      setAlertaMensaje("No se encontró el Id del usuario.");
      setAlertaBorrar(true);
      return;
    }
    const respuesta = await axios.delete(`http://10.0.2.2:3000/api/usuarios/eliminar/${usuarioId}`);
    if (respuesta.status === 200 || respuesta.status === 204) {
        setAlertaMensaje("Tu cuenta ha sido eliminada correctamente.");
        setAlertaBorrar(true);
        //Borrar en local por seguridad
        await AsyncStorage.clear()
        setTimeout(() => {
          setAlertaBorrar(false);
          router.replace("/PantallaHome");
        }, 1800);
      }
  }
  catch(error){
    console.error("Error al borrar la reseña: ", error);
  }
}
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
      <TouchableOpacity onPress={() => router.push("/PantallaPrincipal")}>
        <Image source={require('@/assets/images/volver.png')} style={styles.iconoVolver}></Image>
      </TouchableOpacity>
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
        <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible3(true)}>
          <Text>Eliminar Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.Boton2}>
          <Text>Actualizar</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={alertaBorrar}
        onRequestClose={() => setAlertaBorrar(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo2}>
          <View style={styles.modalBloque2}>
            <Image source={require('@/assets/images/alertBorrar.png')} style={styles.iconoEdit}></Image>
            <Text style={styles.textoNotificacion}>{alertaMensaje}</Text>
          </View>
        </View>
      </Modal>
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
      <Modal visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque}>
             <Text style={styles.textoDescripcion4}>Edita tus datos del perfil</Text>
            <View style={styles.contenedorComentario2}>
              <View style={styles.subContenedor0}>
                <Text style={styles.texto}>Nombre</Text>
                <TextInput style={styles.input1} placeholder='Introduce tu nombre' value={nombreEditar} onChangeText={setNombreEditar}
                  multiline={true}           
                  numberOfLines={5}     
                  maxLength={300}>
                </TextInput>
              </View>
            </View>
            <View style = {styles.contenedorBotones2}>
              <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible2(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.Boton2}>
                <Text>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible3}
        onRequestClose={() => setModalVisible3(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque3}>
            <Text style={styles.titulos2}>Eliminar Cuenta</Text>
            <Text style={styles.textoDescripcion4}>¿Seguro que quieres borrar esta usuario?</Text>
          <View style = {styles.contenedorBotones2}>
            <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible3(false)}>
              <Text>No, cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.Boton2} onPress={() => borrarUsuario()}>
              <Text>Sí, borrar</Text>
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
  iconoVolver:{
    height:35,
    width:35,
    marginRight:280
  },
  iconoEdit:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
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
  textoNotificacion:{
    fontSize:16
  },
  modalFondo2:{
    backgroundColor:"rgba(0,0,0,0.2)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  modalBloque2:{
    display:"flex",
    flexDirection:"row",
    backgroundColor:"#FFFFFF",
    paddingLeft:20,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:20,
    gap:40,
    width:350,
    height:60,
    marginTop:500,
    alignContent:"flex-start",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  subContenedor0:{
    display:"flex",
    flexDirection:"column",
    gap:8,
    marginTop:10
  },
  titulos2:{
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf:"center",
    marginBottom:20
  },
  texto:{
    fontSize:15
  },
  input1:{
    borderColor:"#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    width:300,
    height:100,
    paddingLeft:15,
    textAlignVertical: 'top',
  },
  textoDescripcion4: { 
    color:"#110501",    
    fontSize: 14,
    marginBottom: 5,
    textAlign:"center"    
  },
  contenedorComentario2:{
    display:"flex",
    flexDirection:"column",
    gap:10
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
  modalBloque3:{
    backgroundColor:"#FFFFFF",
    padding:30,
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
    gap:25
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
    marginLeft:40,
    marginTop:20
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