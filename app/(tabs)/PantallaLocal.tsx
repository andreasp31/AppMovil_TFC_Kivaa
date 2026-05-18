import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback , TouchableOpacity, TextInput} from 'react-native';
import { useRouter, Stack, useFocusEffect,useLocalSearchParams} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Local {
  _id: string;
  nombre: string;
  tipo: string;     
  direccion: string; 
  latitud: number;   
  longitud: number;  
  descripcion?: string;
  cualificacion?: number;
  foto?: string;
  horario: string;
  enlace: string;
}

export default function PantallaPrincipal() {
  //Para cambiar entre pantallas
  const router = useRouter();
  //coger el local de la anterior pantalla
  const { id } = useLocalSearchParams();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [local, setLocal] = useState<Local | null>(null);
  
  useEffect(() =>{
    const detallesLocal = async () => {
      try{
        const resultado = await axios.get(`http://10.0.2.2:3000/api/locales/${id}`);
        setLocal(resultado.data);
      }
      catch(error){
        console.error("Error al cargar el local: ",error);
     }
    }
    if(id){
      detallesLocal();
    }
  },[id]);

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

  if (!local) {
      return (
        <View>
          <Text>No se encontraron los datos del local.</Text>
        </View>
      );
    }

    //gestionar favoritos
const manejarFavoritos = async (localId: string)=>{
  try{
    const usuarioId = await AsyncStorage.getItem("idUsuario");
    const resultado = await axios.post("http://10.0.2.2:3000/api/locales/favorito",{
      localId,
      usuarioId
    });

  }
  catch(error){
    console.error("Error al gestionar los favoritos", error);
  }
}

  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
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
      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.contenedorGeneral}>
        <Image source={{ uri: local.foto }} style={styles.fotoTarjeta}></Image>
        <TouchableOpacity onPress={() => manejarFavoritos(local._id)}>
            <Image source={require('@/assets/images/favoritosOff.png')} style={styles.iconoFav}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/PantallaPrincipal")}>
            <Image source={require('@/assets/images/volver.png')} style={styles.iconoVolver}></Image>
        </TouchableOpacity>
        <View style={styles.tarjetaInfo}>
          <View style={styles.tarjetaCabecera}>
            <Text style={styles.tarjetaTitulo}>{local.nombre}</Text>
              <Text style={styles.tipoTarjeta}>{local.tipo}</Text>
              <View style={styles.apartadosTarjeta}>
                <Image source={require('@/assets/images/MapPin.png')} style={styles.iconoEstrella}></Image>
                <Text style={styles.tarjetaDireccion}>{local.direccion}</Text>
              </View>
              <View style={styles.apartadosTarjeta}>
                <Image source={require('@/assets/images/Clock.png')} style={styles.iconoEstrella}></Image>
                <Text style={styles.tarjetatexto}>{local.horario}</Text>
              </View>
              <View style={styles.apartadosTarjeta}>
                <Image source={require('@/assets/images/web.png')} style={styles.iconoEstrella}></Image>
                <Text style={styles.tarjetatexto}>{local.enlace}</Text>
              </View>
          </View>
          <View style={styles.tarjetaNota}>
            <View style={styles.contenedorNota}>
              <Image source={require('@/assets/images/star_filled.png')} style={styles.iconoEstrella}></Image>
              <Text style={styles.tarjetatexto}>{local.cualificacion}</Text>
            </View>
            <Text>Cualificación</Text>
          </View> 
        </View>
        <View>
          <View style={styles.contenedorComentario}>
            <Text style={styles.tarjetaTitulo2}>Comentarios</Text>
            <TouchableOpacity style={styles.contenedorResena}>
              <Image source={require('@/assets/images/Plus.png')} style={styles.iconoMas}></Image>
              <Text style={styles.tarjetatextoSec}>Reseña</Text>
            </TouchableOpacity>
          </View>
          
        </View>
    </ScrollView>  
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
  container3:{
    display:"flex",
  },
  tarjeta:{
    borderWidth:1,
    borderColor:"#9C9696",
    borderRadius:20,
    padding:10,
    display:"flex",
    flexDirection:"row",
    gap:10,
    marginBottom:10,
    width:330,
    alignSelf:"center",
    margin:0
  },
  contenedorComentario:{
    marginTop:25,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:140
  },
  apartadosTarjeta:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:10
  },
  tarjetaNota:{
    marginTop:10,
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:5
  },
  iconoFav:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:285
  },
  iconoVolver:{
    height:35,
    width:35,
    position:"absolute",
    marginTop: -140,
    marginLeft:15
  },
  iconoEstrella:{
    height:20,
    width:20,
  },
  iconoMas:{
    height:15,
    width:15,
  },
  contenedorResena:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:5,
    backgroundColor:"#212121",
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:20,
    alignSelf:"flex-end"
  },
   contenedorNota:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:5,
    backgroundColor:"#FAD934",
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:20,
    alignSelf:"flex-end"
  },
  tarjetaInfo:{
    display:"flex",
    flexDirection:"row",
    gap:10,
    marginTop:10
  },
  tarjetaCabecera:{
    display:"flex",
    flexDirection:"column",
    alignItems:"flex-start",
    gap:10,
    width:240,
    marginTop:10
  },
  tarjetaTitulo:{
    fontSize:20,
    fontWeight:600
  },
  tarjetaTitulo2:{
    fontSize:18,
    fontWeight:600
  },
  tarjetaDescripcion:{

  },
  fotoEditar:{

  },
  tarjetaDireccion:{
    fontSize:12,
    color:"#9C9696"
  },
  tarjetatexto:{
    fontSize:12
  },
  tarjetatextoSec:{
    fontSize:12,
    color:"#FBF6F1"
  },
  fotoTarjeta:{
    width:330,
    height:150,
    borderRadius:10,
    marginTop:5,
    position:"relative"
  },
  tipoTarjeta:{
    borderRadius:30,
    borderWidth:1,
    borderColor:"#9C9696",
    color:"#9C9696",
    width:120,
    padding:3,
    textAlign:"center",
    fontSize:13
    
  },
  contenedorGeneral:{
    margin:3,
  },
  cajaScroll2:{
    marginLeft:10,
    marginRight:10,
    height:440,
    marginTop:15
  },
  menuBuscador:{
    position:"absolute",
    zIndex:1000,
    backgroundColor:"#ffffff",
    marginTop:55,
    paddingVertical:25,
    width:320,
    paddingLeft:20,
    borderRadius:15
  },
  iconoPin:{
    width:45,
    height:45,
    resizeMode:"contain"
  },
  bloqueMarcador:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  fondoTexto:{
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#110501",
    alignSelf: "center",
    minWidth: 80
  },
  buscadorContainer:{
    borderWidth:1,
    borderRadius:20,
    paddingHorizontal:30,
    paddingVertical:2,
    width:320,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  contenedorBusqueda:{
    marginBottom:10

  },
  linea:{
    width:280,
    height:3,
    marginTop:10
  },
  textoBuscador:{

  },
  textoLugar:{
    display:"flex",
    flexDirection:"column",
    paddingBottom:20
  },
  mapa:{
    width: 350,
    height: 250,
    borderRadius: 100,
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
    justifyContent:"center",
    marginRight:60, 
    marginTop:20,
    textAlign:"center",
    color:"black",
    gap:5
  },
  bloqueBotones:{
    display:"flex",
    flexDirection:"column",
    marginTop:5,
    alignItems:"flex-end",
    width:330,
    gap:10
  },
  textoBlanco:{
    color:"#FBF6F1"
  },
  botonfiltro:{
    backgroundColor:"#110501",
    display:"flex",
    flexDirection:"row",
    gap:10,
    paddingHorizontal:20,
    paddingVertical:8,
    borderRadius:20,
    alignItems:"center",
    width:110,
    alignSelf:"flex-end"
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
  icono2:{
    height:60,
    width:60
  },
  icono3:{
    height:15,
    width:15
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
    fontSize: 20
  }
});
