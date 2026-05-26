import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Comentarios {
  _id: string;
  comentario: string;
  estrellas: number;
  fecha: string;
  localId: {
    nombre: string;
  }
}

export default function PantallaResena() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [comentarios, setComentarios] = useState<Comentarios[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reseñaSeleccionada, setReseñaSeleccionada] = useState<Comentarios | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [nuevasEstrellas, setNuevasEstrellas] = useState();

  useFocusEffect(
  useCallback(()=>{
    const obtenerDatos = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const usuarioId = await AsyncStorage.getItem("idUsuario");
        if(nombre){
          setNombreUsuario(nombre);
        }
        if(usuarioId){
          const resultado = await axios.get(`http://10.0.2.2:3000/api/${usuarioId}/resenas`);
          setComentarios(resultado.data);
        }
      }
      catch(error){
        console.error("Error al cargar los datos", error);
      }
    };
    obtenerDatos();
  }, [])
)

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

  const editarComentario= async()=>{
    if (!reseñaSeleccionada) return;
    try{

      setModalVisible(false);
    }
    catch(error){

    }
  }

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
      <Text style={styles.titulos}>Mis Reseñas</Text>
      <FlatList
        data={comentarios}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.textoBold}>Aún no has escrito ningún comentario.</Text>}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <View style={styles.contenedor1}>
              <Text style={styles.textoBold}>{item.localId?.nombre}</Text>
              <Text style={styles.textoDescripcion2}>"{item.comentario}"</Text>
              <Text style={styles.textoDescripcion3}>{new Date(item.fecha).toLocaleDateString()}</Text>
            </View>
            <View style={styles.contenedor2}>
              <Text style={styles.textoDescripcion}>{notaEstrellas(item.estrellas)}</Text>
              <TouchableOpacity onPress={()=>setModalVisible(true)}>
                <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        transparent={true}>
          <View style={styles.modalFondo}>
            <View style={styles.modalBloque}>
              <Text style={styles.titulos}>Editar reseña</Text>
              <Text></Text>
              <View style = {styles.contenedorBotones2}>
                <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible(false)}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Boton2} onPress={editarComentario}>
                  <Text>Guardar</Text>
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
  iconoEstrellaComentario: {
    height: 14, 
    width: 14,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    marginTop:10
  },
  tarjeta:{
    borderWidth:1,
    borderColor:"#9C9696",
    borderRadius:20,
    padding:15,
    display:"flex",
    flexDirection:"row",
    marginBottom:10,
    width:330,
    alignSelf:"center",
    margin:0
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
  iconoEditar:{
    height:15,
    width:15
  },
  contenedor1:{
    display:"flex",
    flexDirection:"column",
    width:230,
    alignItems:"flex-start",
    justifyContent:"flex-start",
    textAlign:"left",
    gap:5
  },
  contenedor2:{
    display:"flex",
    flexDirection:"column",
    gap:55,
    width:100,
    alignItems:"flex-end",
    marginLeft:-30,
    marginTop:5
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
    color:"#110501",     
    fontSize: 14,
    marginBottom: 5,    
  },
  textoDescripcion3: { 
    color:"#110501",     
    fontSize: 13,
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
    fontWeight: 'bold',
    fontSize:18
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
    marginLeft:35,
    marginBottom:20
  }
});