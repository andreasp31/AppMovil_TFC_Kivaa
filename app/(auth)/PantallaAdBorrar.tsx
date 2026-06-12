import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, Modal, TextInput, ScrollView, FlatList} from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Local {
  _id: string;
  nombre: string;
  tipo: string;     
  direccion: string; 
  latitud: number;   
  longitud: number;  
  descripcion?: string;
  calificacion?: number;
  foto?: string;
}

export default function PantallaAdminBorrar() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [localesBusqueda, setLocalesBusqueda] = useState<Local[]>([]);
  const [localSeleccionada, setLocalSeleccionada] = useState<Local | null>(null);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [alertaBorrar, setAlertaBorrar] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [modalCerrarSesion, setCerrarSesion] = useState(false);
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text

  useFocusEffect(
  useCallback(()=>{
    const nombreUsuario = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        if(nombre){
          setNombreUsuario(nombre);
          const resultados = await axios.get(`http://10.0.2.2:3000/api/locales`);
          setLocales(resultados.data);
          setLocalesBusqueda(resultados.data);
        }
      }
      catch(error){
        console.error("Error al cargar el nombre", error);
      }
    };
    nombreUsuario();
  }, [])
)

const manejarBusqueda = (texto: string) => {
    setBusqueda(texto);
    const textoMinusculas = texto.toLowerCase().trim();

    if (textoMinusculas === "") {
      setLocalesBusqueda(locales);
      return;
    }

    const filtrados = locales.filter(local => {
      const nombre = local.nombre.toLowerCase();
      const tipo = local.tipo.toLowerCase();
      return nombre.includes(textoMinusculas) || tipo.includes(textoMinusculas);
    });

    setLocalesBusqueda(filtrados);
  };

  const filtrarCategoria = (categoria: string) => {
    setBusqueda(categoria);
    const filtrados = locales.filter(local =>
      local.tipo.toLowerCase().includes(categoria.toLowerCase())
    );
    setLocalesBusqueda(filtrados);
  };

  const borrarLocal = async() => {
    if (!localSeleccionada) {
      setAlertaMensaje("No se ha seleccionado ningún local.");
      setAlertaBorrar(true);
      return;
    }
    try{
      const respuesta = await axios.delete(`http://10.0.2.2:3000/api/local/eliminar/${localSeleccionada._id}`);
      if (respuesta.status === 200) {
        const localesFiltrados = locales.filter(item => item._id !== localSeleccionada._id);
        setLocales(localesFiltrados);
        setLocalesBusqueda(localesFiltrados.filter(local => 
          local.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
          local.tipo.toLowerCase().includes(busqueda.toLowerCase())
        ));
        setModalVisible2(false);
        setLocalSeleccionada(null);

        setAlertaMensaje("Se ha borrado correctamente el local.");
        setAlertaBorrar(true);
        setTimeout(() => {
          setAlertaBorrar(false);
        }, 1500);
      }
    }
    catch(error){
      console.error("Error al borrar el local: ", error);
    }
  }
  
  const tarjeta = ({ item }: { item: Local }) => {
      console.log("Datos de la tarjeta:", item);
      return(
        <TouchableOpacity style={styles.tarjeta}>
          <Image source={{ uri: item.foto }} style={styles.fotoTarjeta}/>
          <View style={styles.tarjetaContenedor}>
            <View style={styles.contenedorSuperior}>
              <View style={styles.contenedorNota}>
                <Image source={require('@/assets/images/star_filled.png')} style={styles.iconoEstrella}></Image>
                <Text style={styles.tarjetatexto}>{item.calificacion}</Text>
              </View>
              <TouchableOpacity style={styles.contenedorIcono} onPress={()=>{setLocalSeleccionada(item);   
                setModalVisible2(true)}}>
                <Image source={require('@/assets/images/delete.png')} style={styles.iconoEditar}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.tarjetaInfo}>
              <Text style={styles.tarjetaTitulo}>{item.nombre}</Text>
              <Text style={styles.tipoTarjeta}>{item.tipo}</Text>
              <View style={styles.apartadosTarjeta}>
                <Image source={require('@/assets/images/MapPin.png')} style={styles.iconoEstrella}></Image>
                <Text style={styles.tarjetaTexto}>{item.direccion}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) 
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style= {styles.containerCabecera} onPress={() => router.push("/PantallaPerfil")}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <TouchableOpacity style={styles.contenedorCuenta} onPress={() => setCerrarSesion(true)}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/PantallaAdmin")}>
        <Image source={require('@/assets/images/volver.png')} style={styles.iconoVolver}></Image>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.buscadorContainer}>
          <TextInput style={styles.textoDescripcion2} placeholder='Busca el local para ver sus reseñas...' value={busqueda} onChangeText={manejarBusqueda} returnKeyType='search' onSubmitEditing={() => manejarBusqueda(busqueda)}></TextInput>
          <TouchableOpacity onPress={()=> manejarBusqueda(busqueda)}>
            <Image source={require('@/assets/images/Search.png')} style={styles.icono3}></Image>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.containerMenu}>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Cafetería")}>
          <Image source={require('@/assets/images/iconoCafeteria.png')} style={styles.icono2} />
          <Text style={styles.textoDescripcion}>Cafeterías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Panadería")}>
          <Image source={require('@/assets/images/iconoDesayuno.png')} style={styles.icono2} />
          <Text style={styles.textoDescripcion}>Panaderías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Supermercado")}>
          <Image source={require('@/assets/images/iconoSuper.png')} style={styles.icono2} />
          <Text style={styles.textoDescripcion}>Supermercados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Restaurante")}>
          <Image source={require('@/assets/images/iconoRestaurante.png')} style={styles.icono2} />
          <Text style={styles.textoDescripcion}>Restaurantes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contenedorGeneral}>
      </View>
      <Text style={styles.textoBold}>Locales Registrados: {localesBusqueda.length}</Text>
      <FlatList
        data={localesBusqueda}
        renderItem={tarjeta}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        style={styles.listaContenedor}
        contentContainerStyle={styles.listaContenidoInterno}
      />
      <Modal visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque3}>
            <Text style={styles.textoBold2}>{ localSeleccionada ? localSeleccionada.nombre: "Borrar Local"}</Text>
            <Text style={styles.textoDescripcion4}>¿Seguro que quieres borrar este local?</Text>
            <View style = {styles.contenedorBotones3}>
              <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible2(false)}>
                <Text>No, cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.Boton2} onPress={() => borrarLocal()}>
                <Text>Sí, borrar</Text>
              </TouchableOpacity>
            </View>
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
  contenedorIcono:{
    alignSelf:"flex-end"
  },
  apartadosTarjeta:{
    display:"flex",
    flexDirection:"row",
    gap:5
  },
  iconoEdit:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
  },
  textoNotificacion:{
    fontSize:16
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
    marginTop:580,
    alignContent:"flex-start",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  modalFondo2:{
    backgroundColor:"rgba(0,0,0,0.2)",
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
  contenedorBotones3:{
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
  listaContenedor: {
    flex: 1,
    width: "100%",
    marginTop:20,
    marginBottom:50
  },
  textoDescripcion4: { 
    color:"#110501",    
    fontSize: 14,
    marginBottom: 5,
    textAlign:"center"    
  },
  textoBold2:{
    fontWeight: 'bold',
    fontSize:18,
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
  listaContenidoInterno: {
    paddingBottom: 30
  },
  icono2:{
    height:60,
    width:60
  },
  iconoVolver:{
    height:35,
    width:35,
    marginRight:300
  },
  modalFondo:{
    backgroundColor:"rgba(0,0,0,0.5)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  contenedorSuperior:{
    display:"flex",
    flexDirection:"row",
    width:180,
    alignItems:"center",
    justifyContent:"flex-end",
    alignContent:"center",
    gap:5
  },
  tarjetaContenedor:{
    display:"flex",
    flexDirection:"column",
    gap:2
  },
  iconoEstrella:{
    height:15,
    width:15
  },
  iconoEditar:{
    height:25,
    width:25
  },
  iconoFav:{
    height:30,
    width:30,
    marginTop:-3
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
  contenedorNota:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:5,
    backgroundColor:"#FAD934",
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:20,
    alignSelf:"flex-start"
  },
  tarjetaInfo:{
    display:"flex",
    flexDirection:"column",
    gap:10,
  },
  tarjetaCabecera:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:10,
    width:300,
    marginLeft:70
  },
  tarjetaTitulo:{
    fontSize:16,
    fontWeight:600
  },
  tarjetatexto:{
    fontSize:12,
    fontWeight:600
  },
  tarjetaDireccion:{
    fontSize:12
  },
  tarjetaTexto:{
    fontSize:12,
    color:"#9C9696"
  },
  fotoTarjeta:{
    width:120,
    height:120,
    borderRadius:10
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
  cajaScroll2:{
    marginLeft:10,
    marginRight:10,
    height:440,
    marginTop:15
  },
  icono3:{
    height:15,
    width:15
  },
  buscadorContainer:{
    borderWidth:1,
    borderRadius:20,
    paddingHorizontal:30,
    paddingVertical:2,
    width:350,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:20
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
    fontSize: 12,   
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
    alignSelf:"center",
    fontSize:18,
    marginTop:20
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
    alignSelf:"center",
  }
});
