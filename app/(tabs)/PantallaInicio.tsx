import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useRouter, Stack , useFocusEffect} from 'expo-router';
import React, { useState , useCallback} from 'react';
import { KivaaBoton } from '../../components/KivaaBoton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [email, ponerEmail] = useState('');
  const [clave, ponerClave] = useState('');
  const [errorMensaje, ponerMensaje] = useState('');
  //Para cambiar entre pantallas
  const router = useRouter();
  const login = async()=>{
      ponerMensaje('');
      try{
        const respuesta = await axios.post("http://10.0.2.2:3000/api/login",{
          email: email,
          clave: clave
        });
        //se guarda el nombre en el local y se coge el nombre de la base de datos
        const { token, usuario } = respuesta.data;
        await AsyncStorage.setItem("nombreUsuario",usuario.nombre);
        await AsyncStorage.setItem("token",token);
        await AsyncStorage.setItem("roleUsuario", usuario.role);
        await AsyncStorage.setItem("emailUsuario", usuario.email);
        if(usuario.role === "admin"){
          
        }
        else{
          
        }
      }
      //El any es para decirle a typescript que se lo que estoy haciendo al llamar error, que sino me da problemas
      catch(error : any){
        let mensajeFinal = "Error al iniciar sesión";
        if (error.response && error.response.data) {
          const data = error.response.data

          // detectar que el email es incorrecto
          if (data.detalles) {
            const primerCampoConError = Object.keys(data.detalles).find(key => key !== '_errors')
            if (primerCampoConError) {
              mensajeFinal = data.detalles[primerCampoConError]._errors[0];
            }
          } 
          // Si el error viene por credenciales incorrectas  
          else if (data.message) {
            mensajeFinal = data.message
          }
        }
        ponerMensaje(mensajeFinal);
      }
    }
     useFocusEffect(
        useCallback(() => {
          ponerEmail('');
          ponerClave('');
          ponerMensaje('');
        }, [])
     );
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style={styles.bloqueIcono}  onPress={() => router.push("/PantallaHome")}>
        <Image source={require('@/assets/images/botonVolver.png')} style={styles.icono} resizeMode="contain"></Image>
      </TouchableOpacity>
      <View style={styles.bloqueCentro}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}  ></Image>
      </View>
      <View style={styles.textos}>
        <Text style={styles.textoTitulo}>Bienvenido,</Text>
        <Text style={styles.texto}>Encuentra un buen sitio en 5 minutos!</Text>
      </View>
      <View style={styles.container3}>
        <Text style={styles.texto}>Correo</Text>
        <TextInput style={styles.input} placeholder='Introduce un correo' autoCapitalize='none' value={email} onChangeText={ponerEmail} keyboardType="email-address"></TextInput>
        <Text style={styles.texto}>Contraseña</Text>
        <TextInput style={styles.input} placeholder='Introduce una contraseña' autoCapitalize='none' value={clave} onChangeText={ponerClave} secureTextEntry={true}></TextInput>
        {errorMensaje ? <Text style={{color: 'red', marginTop: 10}}>{errorMensaje}</Text> : null}
      </View>
      <View style={styles.container2}>
        <Text style={styles.texto}>Olvidaste tu contraseña?</Text>
        <KivaaBoton titulo="Iniciar Sesión" onPress={() => router.push("/PantallaHome")}></KivaaBoton>
        <Text style={styles.texto}>Si no tienes cuenta, <Text style={styles.textoEnlace}>regístrate </Text></Text>
        <Image source={require('@/assets/images/separacion.png')} style={styles.icono3}></Image>
        <TouchableOpacity style={styles.botonGoogle}>
          <Image source={require('@/assets/images/logoGoogle.png')} style={styles.icono2}></Image>
          <Text>Inicia Sesión con Google</Text>
        </TouchableOpacity>
      </View>
    </View>  
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'MiFuentePersonalizada',
    flex: 1,
    backgroundColor: "white",
  },
  contenedor1:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:2,
  },
  texto:{
    fontSize:15
  },
  textoEnlace:{
    fontWeight:"bold",
    color:"#D8B610"
  },
  textoTitulo:{
    fontSize:25,
    fontWeight:"bold"
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
    marginTop:20
  },
  container3: {
    alignItems: "flex-start",
    gap:10,
    marginTop:30,
    marginLeft:50,
    zIndex: 3
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
    marginTop:-80
  },
  icono:{
    width:50,
    height:50,
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
    alignItems:"flex-start",
    marginTop:-40,
    marginLeft:50,  
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
  foto3: {
    marginTop:30,
    height: 220,
    width: 220,
    resizeMode: "contain",
    alignItems:"center"
  },
  foto2: {
    position: 'absolute',
    bottom: 0,     
    height: 240,
    width: 350,
    resizeMode: "contain",
    zIndex:-1,
    pointerEvents:"none"
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
  },
  icono2:{
    width:30,
    height:30,
  },
  icono3:{
    width:300,
    height:45
  }
});