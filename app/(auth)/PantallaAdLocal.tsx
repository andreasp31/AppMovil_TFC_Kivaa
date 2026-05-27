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

interface Comentarios {
  _id: string;
  usuarioNombre: string;
  comentario: string;
  estrellas: number;
  fecha: string;
}

export default function PantallaPrincipal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [local, setLocal] = useState<Local | null>(null);
  const [comentarios, setComentarios] = useState<Comentarios[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [alertaFav, setAlertaFav] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  
  useEffect(() =>{
    const detallesLocal = async () => {
      try{
        const resultado = await axios.get(`http://10.0.2.2:3000/api/locales/${id}`);
        const comentarios = await axios.get(`http://10.0.2.2:3000/api/locales/${id}/resenas`);
        setLocal(resultado.data);
        setComentarios(comentarios.data);
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
          const usuarioId = await AsyncStorage.getItem("idUsuario");
          if(nombre){
            setNombreUsuario(nombre);
          }
          if (usuarioId) {
          const resultado = await axios.get(`http://10.0.2.2:3000/api/locales/favoritos/${usuarioId}`);
          const idsFavoritos = resultado.data.map(
            (local: Local) => local._id
          );
          setFavoritos(idsFavoritos);
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
        <View style={styles.container}>
          <Text>No se encontraron los datos del local.</Text>
        </View>
      );
    }

  //gestionar favoritos
const manejarFavoritos = async (localId: string)=>{
  try{
    const usuarioId = await AsyncStorage.getItem("idUsuario");
    console.log("ID del Local enviado:", localId);
    console.log("ID del Usuario recuperado de AsyncStorage:", usuarioId);
    const resultado = await axios.post("http://10.0.2.2:3000/api/locales/favorito",{
      localId,
      usuarioId
    });
    if (favoritos.includes(localId)) {
      setFavoritos(favoritos.filter(id => id !== localId));
    } else {
      setFavoritos([...favoritos, localId]);
    }
    setAlertaFav(true);
    setAlertaMensaje(resultado.data.message);
    setTimeout(() => {
      setAlertaFav(false);
    }, 1500);
  }
  catch(error){
    console.error("Error al gestionar los favoritos", error);
    setAlertaFav(true);
    setAlertaMensaje("Hubo el error al guardar en favoritos");
    setTimeout(() => {
      setAlertaFav(false);
    }, 2500);
  }
}

  function notaEstrellas(nota : number){
    let listaEstrellas = [];
    for(let i=1; i<=5; i++){
      if(i <= nota){
        listaEstrellas.push(
          <Image key={i} source={require("@/assets/images/estrellaAmarilla.png")} style={styles.iconoEstrellaComentario}></Image>
        )
      }
      else{
        listaEstrellas.push(
          <Image key={i} source={require("@/assets/images/estrellaGris.png")} style={styles.iconoEstrellaComentario}></Image>
        )
      }
    }
    return listaEstrellas;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity style={styles.containerCabecera} onPress={() => router.push("/PantallaPerfil")}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <View style={styles.contenedorCuenta}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.contenedorGeneral}>
        <Image source={{ uri: local.foto }} style={styles.fotoTarjeta}></Image>
        
        <TouchableOpacity onPress={()=> manejarFavoritos(local._id)}>
          <Image source={
            favoritos.includes(local._id)
              ? require('@/assets/images/iconoFavActivo.png')
              : require('@/assets/images/favoritosOff.png')
          }
          style={styles.iconoFav}
          />
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

        <View style={styles.bloqueInferior}>
          <View style={styles.contenedorComentario}>
            <Text style={styles.tarjetaTitulo2}>Comentarios</Text>
            <TouchableOpacity style={styles.contenedorResena}>
              <Image source={require('@/assets/images/Plus.png')} style={styles.iconoMas}></Image>
              <Text style={styles.tarjetatextoSec}>Reseña</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            nestedScrollEnabled={true} 
            showsVerticalScrollIndicator={false} 
            style={styles.contenedorComentarios}
          >
              {comentarios.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                  Nadie ha comentado aún.
                </Text>
              ) : (
                comentarios.map((item) => (
                  <View style={styles.tarjeta} key={item._id}>
                    <View style={styles.contenedor2}>
                      <Text style={styles.textoBold}>{item.usuarioNombre}</Text>
                      <View style={styles.contenedorEstrella}>{notaEstrellas(item.estrellas)}</View>
                    </View>
                    <View style={styles.contenedor1}>
                      <Text style={styles.textoDescripcion2}>"{item.comentario}"</Text>
                      <Text style={styles.textoDescripcion3}>{new Date(item.fecha).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
        </View>
      </View> 
      <Modal visible={alertaFav}
        onRequestClose={() => setAlertaFav(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo2}>
          <View style={styles.modalBloque2}>
            <Image source={require('@/assets/images/iconoFavGris.png')} style={styles.iconoFav}></Image>
            <Text style={styles.textoNotificacion}>{alertaMensaje}</Text>
          </View>
        </View>
      </Modal> 
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "white",
  },
  contenedor2: {
    display:"flex",
    flexDirection:"row",
    width:290,
    justifyContent:"space-between",
    marginTop:10,
    gap:50,
    alignItems:"center",
    marginLeft:5
    
  },
  container3:{
    display:"flex",
  },
  contenedorEstrella:{
    display:"flex",
    flexDirection:"row",
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
  textoNotificacion:{
    fontSize:16
  },
  tarjeta:{
    display:"flex",
    borderWidth:1,
    borderColor:"#9C9696",
    borderRadius:20,
    padding:10,
    flexDirection:"column",
    marginBottom:10,
    width:320,
    alignSelf:"center",
  },
  contenedorComentarios:{
    width:320,
    marginTop:15,
    maxHeight: 220, 
    alignSelf: "center"
  },
  bloqueInferior:{
    flexDirection:"column",
    gap:5,
    flex: 1
  },
  contenedor1:{
    flexDirection:"column",
    width:210, 
    alignItems:"flex-start",
    justifyContent:"flex-start",
    gap:5,
    marginLeft:5
  },
  contenedorComentario:{
    marginTop:25,
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    width: 320,
    alignSelf: "center"
  },
  apartadosTarjeta:{
    flexDirection:"row",
    alignItems:"center",
    gap:10
  },
  tarjetaNota:{
    marginTop:10,
    flexDirection:"column",
    alignItems:"center",
    gap:5
  },
  iconoFav:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
  },
  iconoEditar:{
    height:15,
    width:15
  },
  textoDescripcion3: { 
    color:"#110501",     
    fontSize: 13,
    marginBottom: 5,    
  },
  iconoVolver:{
    height:35,
    width:35,
    position:"absolute",
    marginTop: -140,
    marginLeft:40
  },
  iconoEstrella:{
    height:20,
    width:20,
  },
  iconoEstrellaComentario: {
    height: 14, 
    width: 14,
  },
  iconoMas:{
    height:15,
    width:15,
  },
  contenedorResena:{
    flexDirection:"row",
    alignItems:"center",
    gap:5,
    backgroundColor:"#212121",
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:20,
  },
   contenedorNota:{
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
    flexDirection:"row",
    gap:10,
    marginTop:10,
    width: 320,
    alignSelf: "center"
  },
  tarjetaCabecera:{
    flexDirection:"column",
    alignItems:"flex-start",
    gap:10,
    width:230,
    marginTop:10
  },
  tarjetaTitulo:{
    fontSize:20,
    fontWeight: "600"
  },
  tarjetaTitulo2:{
    fontSize:18,
    fontWeight: "600"
  },
  tarjetaDescripcion:{

  },
  fotoEditar:{

  },
  tarjetaDireccion:{
    fontSize:12,
    color:"#6d6464ff"
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
    position:"relative",
    alignSelf: "center"
  },
  tipoTarjeta:{
    borderRadius:30,
    borderWidth:1,
    borderColor:"#6d6464ff",
    color:"#6d6464ff",
    width:120,
    padding:3,
    textAlign:"center",
    fontSize:13
    
  },
  contenedorGeneral:{
    flex: 1,
    width: '100%',
    margin: 3,
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
    flexDirection:"column",
    paddingBottom:20
  },
  mapa:{
    width: 350,
    height: 250,
    borderRadius: 100,
  },
  containerCabecera:{
    flexDirection:"row",
    justifyContent: "space-between", 
    width: 320,
    marginTop:60
  },
  contenedorCuenta:{
    flexDirection:"column",
    gap:5,
    alignItems: "center"
  },
  contenedorIconos:{
    flexDirection:"column",
    alignItems:"center",
    gap:4
  },
  containerMenu:{
    flexDirection:"row",
    gap:20,
    marginTop:20
  },
  textos:{
    flexDirection:"column",
    justifyContent:"center",
    marginRight:60, 
    marginTop:20,
    textAlign:"center",
    color:"black",
    gap:5
  },
  bloqueBotones:{
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
    width: 120, 
    resizeMode: "contain"
  },
  foto2: {
    bottom: 0,            
    height: 340,
    width: 550,
    resizeMode: "contain",
  },
  textoBold:{
    fontWeight: 'bold',
    fontSize: 16
  },
  containerFotos:{
    flexDirection: "column",
    alignItems: "center",
    marginTop: 70
  },
  titulos:{
    fontWeight: 'bold',
    fontSize: 20
  }
});