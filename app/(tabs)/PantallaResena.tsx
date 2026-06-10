import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text, FlatList, Modal, TextInput } from 'react-native';
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
  const [modalVisible2, setModalVisible2] = useState(false);
  const [reseñaSeleccionada, setReseñaSeleccionada] = useState<Comentarios | null>(null);
  const [opinion, setOpinion] = useState('');
  const [notaestrellas, setNotaEstrellas] = useState(0);
  const estrellas = [1,2,3,4,5];
  const [idUsuario, setIdUsuario] = useState<String | null>(null);
  const [alertaActualizar, setAlertaActualizar] = useState(false);
  const [alertaBorrar, setAlertaBorrar] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);

  useFocusEffect(
  useCallback(()=>{
    const obtenerDatos = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const usuarioId = await AsyncStorage.getItem("idUsuario");
        const fotoGuardada = await AsyncStorage.getItem("fotoUsuario");
        const token = await AsyncStorage.getItem("token");
        if(nombre){
          setNombreUsuario(nombre);
        }
        if(token){
          setIdUsuario(usuarioId)
          const resultado = await axios.get(`http://10.0.2.2:3000/api/misResenas`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          setComentarios(resultado.data);
        }
        if (fotoGuardada) {
            setFotoUsuario(fotoGuardada);
          } 
        else {
          setFotoUsuario(null);
        }
      }
      catch(error){
        console.error("Error al cargar los datos", error);
      }
    };
    obtenerDatos();
  }, [])
)

const actualizarResena = async() => {
  if (opinion.trim() === "") {
    setAlertaMensaje("Por favor, introduce un comentario antes de publicar.");
    setAlertaActualizar(true);
    return;
  }
  if (!reseñaSeleccionada) {
    setAlertaMensaje("No se ha seleccionado ninguna reseña para editar.");
    setAlertaActualizar(true);
    return;
  }
  try{
    const token = await AsyncStorage.getItem("token");
    const nuevaResena = {
      comentario: opinion,
      estrellas: notaestrellas,
      fecha: new Date().toISOString() 
    };
    console.log(nuevaResena)
    const respuesta = await axios.put(`http://10.0.2.2:3000/api/resenas/actualizar/${reseñaSeleccionada._id}`, nuevaResena, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    if (respuesta.status === 200 || respuesta.status === 201) {
      const comentariosActualizados = comentarios.map((item) => {
        if (item._id === reseñaSeleccionada._id) {
          return {
            ...item,                     
            comentario: opinion,         
            estrellas: notaestrellas,  
            fecha: new Date().toISOString() 
          };
        }
        return item;
      });

      setComentarios(comentariosActualizados);
      
      // Cerramos modal y reseteamos el formulario
      setModalVisible(false);
      setOpinion('');
      setNotaEstrellas(0); 
      setReseñaSeleccionada(null);
      
      setAlertaActualizar(true);
      setTimeout(() => {
        setAlertaActualizar(false);
      }, 1500);
    }

  }
  catch(error){
    console.error("Error al publicar la reseña: ", error);
  }
}

const borrarResena = async() => {
  if (!reseñaSeleccionada) {
    setAlertaMensaje("No se ha seleccionado ninguna reseña para editar.");
    setAlertaBorrar(true);
    return;
  }
  try{
    const respuesta = await axios.delete(`http://10.0.2.2:3000/api/resenas/eliminar/${reseñaSeleccionada._id}`);
    if (respuesta.status === 200) {
      const comentariosFiltrados = comentarios.filter(item => item._id !== reseñaSeleccionada._id);
      setComentarios(comentariosFiltrados);
      setModalVisible2(false);
      setReseñaSeleccionada(null);

      setAlertaMensaje("Se ha borrado correctamente la reseña.");
      setAlertaBorrar(true);
      setTimeout(() => {
        setAlertaBorrar(false);
      }, 1500);
    }
  }
  catch(error){
    console.error("Error al borrar la reseña: ", error);
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
      <TouchableOpacity style= {styles.containerCabecera} onPress={() => router.push("/PantallaPerfil")}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <View style={styles.contenedorCuenta}>
          <Image key={fotoUsuario} source={fotoUsuario ? { uri: fotoUsuario } : require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.titulos}>Mis Reseñas</Text>
      <FlatList
        style={styles.listaScroll}
        contentContainerStyle={styles.scrollContenido}
        data={comentarios}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.contenedorOpcion}>
            <Image source={require('@/assets/images/comment.png')} style={styles.iconoCorazon}></Image>
            <Text style={styles.textoBold}>Aún no has añadido ningún comentario.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <View style={styles.contenedor1}>
              <Text style={styles.textoBold}>{item.localId?.nombre}</Text>
              <Text style={styles.textoDescripcion2}>"{item.comentario}"</Text>
              <Text style={styles.textoDescripcion3}>{new Date(item.fecha).toLocaleDateString()}</Text>
            </View>
            <View style={styles.contenedor2}>
              <Text style={styles.textoDescripcion}>{notaEstrellas(item.estrellas)}</Text>
              <View style={styles.contenedorIconosTarjeta}>
                <TouchableOpacity onPress={()=>{setReseñaSeleccionada(item);   
                  setOpinion(item.comentario);       
                  setNotaEstrellas(item.estrellas);
                  setModalVisible(true)}}>
                    <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setReseñaSeleccionada(item);   
                  setModalVisible2(true)}}>
                    <Image source={require('@/assets/images/delete.png')} style={styles.iconoEditar}></Image>
                </TouchableOpacity>
              </View>
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
            <Text style={styles.titulos2}>{reseñaSeleccionada ? reseñaSeleccionada.localId?.nombre : "Editar Reseña"}</Text>
            <Text style={styles.textoDescripcion4}>Edita tu valoración para que otras personas puedan conocer tu opinión!</Text>
            <View style={styles.contenedorComentario2}>
              <View style={styles.subContenedor0}>
                <Text style={styles.texto}>Comentario</Text>
                <TextInput style={styles.input1} placeholder='Introduce tu opinión' value={opinion} onChangeText={setOpinion}
                  multiline={true}           
                  numberOfLines={5}     
                  maxLength={300}>
                </TextInput>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Nota</Text>
                  <View style={styles.filaEstrellas}>
                    {estrellas.map((numeroEstrella) =>{
                      const estrellaActiva = numeroEstrella <= notaestrellas;
                      return(
                        <TouchableOpacity key={numeroEstrella} onPress={() => setNotaEstrellas(numeroEstrella)} style={styles.estrellaFormulario}>
                          <Image source={
                            estrellaActiva
                            ? require('@/assets/images/estrellaAmarilla.png')
                            : require('@/assets/images/estrellaGris.png')
                          } style={styles.iconoEstrella}></Image>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View style = {styles.contenedorBotones2}>
                <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible(false)}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Boton2} onPress={() => actualizarResena()}>
                  <Text>Actualizar</Text>
                </TouchableOpacity>
              </View>
            </View>
         </View>
      </Modal> 
      <Modal visible={alertaActualizar}
        onRequestClose={() => setAlertaActualizar(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo2}>
          <View style={styles.modalBloque2}>
            <Image source={require('@/assets/images/editAlerta.png')} style={styles.iconoEdit}></Image>
            <Text style={styles.textoNotificacion}>Se ha actualizado correctamente la reseña</Text>
          </View>
        </View>
      </Modal>
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
      <Modal visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque3}>
            <Text style={styles.textoBold2}>Reseña a {reseñaSeleccionada ? reseñaSeleccionada.localId?.nombre : "Editar Reseña"}</Text>
            <Text style={styles.textoDescripcion4}>¿Seguro que quieres borrar esta reseña?</Text>
              <View style = {styles.contenedorBotones2}>
                <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible2(false)}>
                  <Text>No, cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.Boton2} onPress={() => borrarResena()}>
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
  iconoEstrellaComentario: {
    height: 14, 
    width: 14,
  },
  textoNotificacion:{
    fontSize:16
  },
  contenedorIconosTarjeta:{
    display:"flex",
    flexDirection:"row",
    gap:10
  },
  scrollContenido: {
    paddingBottom: 40, 
  },
  listaScroll: {
    width: "100%",
    height: 520,
    flexGrow: 0,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    marginTop:10
  },
  filaEstrellas:{
    display:"flex",
    flexDirection:"row",
    gap:5
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
  iconoEdit:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
  },
  modalFondo2:{
    backgroundColor:"rgba(0,0,0,0.2)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  contenedorOpcion:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:8,
    marginTop:10
  },
  iconoCorazon:{
    height:40,
    width:40
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
  texto:{
    fontSize:15
  },
  estrellaFormulario:{
    padding:3
  },
  iconoEstrella:{
    height:20,
    width:20,
  },
  subContenedor0:{
    display:"flex",
    flexDirection:"column",
    gap:8,
    marginTop:10
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
    gap:10,
    width:350,
    display:"flex",
    alignItems:"center"
  },
  modalBloque3:{
    backgroundColor:"#FFFFFF",
    padding:40,
    borderRadius:20,
    gap:10,
    width:350,
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    alignContent:"center",
    justifyContent:"center"
  },
  contenedorBotones2:{
    display:"flex",
    flexDirection:"row",
    marginTop:20,
    gap:20
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
    height:18,
    width:18,
    marginTop:-5
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
    alignItems:"center",
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
    fontSize:18,
  },
  textoBold2:{
    fontWeight: 'bold',
    fontSize:18,
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
  },
  titulos2:{
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf:"center",
    marginBottom:20
  }
});