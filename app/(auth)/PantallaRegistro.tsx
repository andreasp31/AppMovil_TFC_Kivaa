import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import { useRouter, Stack} from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KivaaBoton } from '../../components/KivaaBoton';

export default function HomeScreen() {
  const [email, ponerEmail] = useState('');
  const [clave, ponerClave] = useState('');
  const [confirmarClave, ponerConfirmarClave] = useState('');
  const [nombre, ponerNombre] = useState('');
  const [apellidos, ponerApellidos] = useState('');
  const [errorMensaje, ponerMensaje] = useState('');
  const [alertaCrear, setAlertaCrear] = useState(false);
  //Para cambiar entre pantallas
  const router = useRouter();
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  const registrar = async()=>{
      ponerMensaje('');
      try{
        const respuesta = await axios.post("http://10.0.2.2:3000/api/registro",{
          nombre: nombre,
          apellidos: apellidos,
          email: email,
          clave: clave,
          clave2: confirmarClave
        });
        setAlertaCrear(true);
        setTimeout(() => {
          setAlertaCrear(false);
          router.replace("/PantallaInicio");
        }, 2000);
      }
      catch (error: any) {
        let mensajeFinal = "Error al registrar";

        if (error.response && error.response.data) {
            const data = error.response.data;
            // formato .format() del backend:
            if (data.detalles) {
                // Buscamos el primer error que aparezca en el objeto formateado
                // Zod .format() devuelve algo como { nombre: { _errors: [] } }
                const primerCampoConError = Object.keys(data.detalles).find(key => key !== '_errors');
                if (primerCampoConError) {
                    mensajeFinal = data.detalles[primerCampoConError]._errors[0];
                }
            } 
            // Por si acaso sigue viniendo como mensaje directo
            else if (data.message) {
                mensajeFinal = data.message;
            }
        }
        ponerMensaje(mensajeFinal);
      }
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style={styles.bloqueIcono}  onPress={() => router.push("/PantallaHome")}>
        <Image source={require('@/assets/images/botonVolver.png')} style={styles.icono} resizeMode="contain"></Image>
      </TouchableOpacity>
      <View style={styles.bloqueCentro}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
      </View>
      <View style={styles.textos}>
        <Text style={styles.textoTitulo}>Regístrate,</Text>
        <Text style={styles.texto}>Crea tu cuenta en 1 minuto.</Text>
      </View>
      <View style={styles.container3}>
        <View style={styles.subContenedor}>
          <View style={styles.subContenedor0}>
            <Text style={styles.texto}>Nombre</Text>
            <TextInput style={styles.input1} placeholder='Nombre' value={nombre} onChangeText={ponerNombre}></TextInput>
          </View>
          <View style={styles.subContenedor0}>
            <Text style={styles.texto}>Apellidos</Text>
            <TextInput style={styles.input1} placeholder='Apellidos' value={apellidos} onChangeText={ponerApellidos}></TextInput>
          </View>
        </View>
        <View style={styles.subContenedor0}>
          <Text style={styles.texto}>Correo</Text>
          <TextInput style={styles.input} placeholder='Introduce un correo' autoCapitalize='none' value={email} onChangeText={ponerEmail} keyboardType="email-address"></TextInput>
        </View>
        <View style={styles.subContenedor0}>
          <Text style={styles.texto}>Contraseña</Text>
          <TextInput style={styles.input} placeholder='Introduce una contraseña' autoCapitalize='none' value={clave} onChangeText={ponerClave} secureTextEntry={true}></TextInput>
        </View>
        <TextInput style={styles.input} placeholder='Repite la contraseña' autoCapitalize='none' value={confirmarClave} onChangeText={ponerConfirmarClave} secureTextEntry={true}></TextInput>
        {errorMensaje ? ( <Text style={styles.mensajeError}>{errorMensaje}</Text>) : null}
      </View>
      <View style={styles.container2}>
        <KivaaBoton titulo="Regístrate" onPress={registrar}></KivaaBoton>
        <Text style={styles.texto}>Si no tienes cuenta, <Text style={styles.textoEnlace} onPress={() => router.push("/PantallaInicio")}>inicia sesión</Text></Text>
      </View>
      <Modal visible={alertaCrear}
        onRequestClose={() => setAlertaCrear(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo2}>
          <View style={styles.modalBloque2}>
            <Image source={require('@/assets/images/newAcc.png')} style={styles.iconoEdit}></Image>
            <Text style={styles.textoNotificacion}>Tu cuenta se ha creado correctamente.</Text>
          </View>
        </View>
      </Modal>
    </View>  
  );
}

//estilos
const styles = StyleSheet.create({
  container: {
    fontFamily: 'MiFuentePersonalizada',
    flex: 1,
    backgroundColor: "white",
  },
  textoEnlace:{
    fontWeight:"bold",
    color:"#D8B610"
  },
  modalFondo2:{
    backgroundColor:"rgba(0,0,0,0.2)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  iconoEdit:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
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
  textoNotificacion:{
    fontSize:16
  },
  contenedor1:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:2,
  },
  subContenedor:{
    display:"flex",
    flexDirection:"row",
    gap:15
  },
  subContenedor0:{
    display:"flex",
    flexDirection:"column",
    gap:8
  },
  mensajeError:{
    color: "red", 
    marginBottom: 5,
    marginTop:2,
    alignSelf:"center"
  },
  input1:{
    borderColor:"#110501",
    borderWidth: 1,
    borderRadius: 20,
    width:140,
    height:50,
    paddingLeft:15,
  },
  texto:{
    fontSize:15
  },
  input:{
    borderColor:"#110501",
    borderWidth: 1,
    borderRadius: 20,
    width:300,
    height:50,
    paddingLeft:15,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    gap:10,
    marginTop:15
  },
  container3: {
    alignItems: 'center',
    gap:10,
    marginTop:20,
  },
  iconos:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:20,
  },
  icono:{
    width:50,
    height:50,
  },
  icono2:{
    width:20,
    height:24,
  },
  miBoton1:{
    backgroundColor: "#eec699",
    color:"#110501",
    padding:13,
    paddingLeft: 60,
    paddingRight: 60,
    borderRadius: 20,
    marginTop: 90
  },
  miBoton2:{
    padding:13,
    paddingLeft: 67,
    paddingRight: 67,
    borderRadius: 20,
    margin:5
  },
  textos:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start",
    alignItems:"flex-start",
    marginTop:-60,
    marginLeft:50, 
    marginRight:30, 
    textAlign:"center",
    color:"black",
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
    height: 220,
    width: 220,
    resizeMode: "contain",
  },
  foto2: {
    marginTop: -180,
    height: 260,
    width: 400,
    resizeMode: "contain"
  },
  bloqueIcono:{
    display:"flex",
    justifyContent:"flex-start",
    marginLeft:40,
    marginTop:70,
    width:40
  },
  bloqueCentro:{
    display:"flex",
    alignItems:"center",
    marginTop:-100
  },
  textoTitulo:{
    fontSize:25,
    fontWeight:"bold",
    marginTop:15
  },
  icono3:{
    width:300,
    height:45
  },
  botonGoogle: {
    display:"flex",
    flexDirection:"row",
    gap:20,
    alignItems:"center",
    borderColor:"#110501",
    borderWidth: 1,
    borderRadius: 20,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:50,
    paddingRight:50
  }
});
