import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback , TouchableOpacity, TextInput} from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
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
}

export default function PantallaPrincipal() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [localesBusqueda, setLocalesBusqueda] = useState<Local[]>([]);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(true);
  const [titulosResultados, setTitulosResultados] = useState("Buscar Local");
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [modalLocal, setModalLocal] = useState(false);
  const [alertaFav, setAlertaFav] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [localSeleccionado, setLocalSeleccionado] = useState<Local | null>(null);
  const mapRef = React.useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: 40.4167,
    longitude: -3.70325,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
  const datosIniciales = async () => {
    // Pedir permiso de ubicación
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso denegado");
      return;
    }
    // Obtener la ubicación actual
    let ubicacion = await Location.getCurrentPositionAsync({});
    // Actualizar la región del mapa con tu posición real
    setRegion({
      latitude: ubicacion.coords.latitude,
      longitude: ubicacion.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    try {
      const res = await axios.get("http://10.0.2.2:3000/api/locales");
      setLocales(res.data);
    } catch (error) {
      console.error("Error cargando locales:", error);
    }
  }
  datosIniciales();
}, []);

useFocusEffect(
  useCallback(()=>{
    const datosUsuario = async () => {
      try {
        const nombre = await AsyncStorage.getItem("nombreUsuario");
        const usuarioId = await AsyncStorage.getItem("idUsuario");
        if(nombre){
          setNombreUsuario(nombre);
        }
        if(usuarioId){
          const resultado = await axios.get(`http://10.0.2.2:3000/api/locales/favoritos/${usuarioId}`);
          const idsFavoritos = resultado.data.map((fav: any) => fav._id);
          setFavoritos(idsFavoritos);
        }
      }
      catch(error){
        console.error("Error al cargar los datos", error);
      }
    };
    datosUsuario();
  }, [])
)

  //Mover el mapa al toca el local de la lista
  const irLocal = (lat:number, lng: number) =>{
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000)
  };

  //Calcular distancia cerca en mapa, esto lo busqué
  const calcularDistancia = (lat1:number, lon1:number, lat2:number, lon2:number) =>{
    const radio = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return radio * c;
  }

  //Función para buscar local
  const manejarBusqueda = (texto: string) =>{
    setBusqueda(texto);
    setMostrarLista(true);
    const textoMinusculas = texto.toLowerCase().trim();
    //si no hay texto se limpia
    if(textoMinusculas.trim() == ""){
      setLocalesBusqueda([]);
      return;
    }
    const palabrasCerca = ["cerca", "aquí", "sin gluten"];
    const busquedaCerca = palabrasCerca.some(p => textoMinusculas.includes(p));
    const busquedas =[];
    for(let i=0; i< locales.length; i++){
      const localEspecifico = locales[i];
      const nombre = localEspecifico.nombre.toLowerCase();
      const tipo = localEspecifico.tipo.toLowerCase();

      const coincideTexto = nombre.includes(textoMinusculas) || tipo.includes(textoMinusculas);
      let filtroCerca = false;
      let distanciaCalculada = null;
      if(busquedaCerca){
        const distanciaCalculada = calcularDistancia(
          region.latitude,
          region.longitude,
          localEspecifico.latitud,
          localEspecifico.longitud
        )
        if(distanciaCalculada < 10){
          filtroCerca = true;
        }
      };
      if(coincideTexto || filtroCerca){
        busquedas.push({ ...localEspecifico, distancia: distanciaCalculada });
      }
    }
    //actualizar estado de los locales buscados
    setLocalesBusqueda(busquedas);
    //Para que se vea en el mapa
    if(busquedas.length > 0){
      irLocal(busquedas[0].latitud, busquedas[0].longitud);
    }
  };

  //Función para enseñar todos los locales cerca 
  const mostrarLocalesCerca = () => {
    const sitiosCerca = locales.filter(local =>{
      const distanciaCalculada = calcularDistancia(
          region.latitude,
          region.longitude,
          local.latitud,
          local.longitud
      );
      //kilometros de cerca
      return distanciaCalculada < 10;
    })
    if (sitiosCerca.length > 0) {
      setLocalesBusqueda(sitiosCerca);
      setMostrarLista(false);
      setBusqueda("Sitios cerca sin gluten");
      
      // Ajustamos el mapa para que se vean varios
      mapRef.current?.animateToRegion({
        ...region,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 1000);
    }
  }

  const filtrarCategoria = (categoria: string) => {
    const filtrados = locales.filter(local =>
      local.tipo.toLowerCase().includes(categoria.toLowerCase())
    );
    setLocalesBusqueda(filtrados);
    if (filtrados.length > 0) {
    const primerLocal = filtrados[0];
    const distancia = calcularDistancia(
      region.latitude,
      region.longitude,
      primerLocal.latitud,
      primerLocal.longitud
    );

    if (distancia < 10) {
      setTitulosResultados(`${categoria} cerca de ti`);
    } else {
      const partesDireccion = primerLocal.direccion.split(',');
      const ciudad = partesDireccion[partesDireccion.length - 1].trim();
      
      setTitulosResultados(`${categoria} en ${ciudad}`);
    }
  } else {
    setTitulosResultados(`No hay ${categoria} disponibles`);
  }
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


  const tarjeta = ({ item }:{item : Local}) => {
    console.log("Datos de la tarjeta:", item);
    return(
      <TouchableOpacity style={styles.tarjeta} onPress={() => router.push({pathname:"/PantallaLocal", params:{id: item._id}})}>
        <Image source={{ uri: item.foto }} style={styles.fotoTarjeta}/>
        <View style={styles.tarjetaContenedor}>
          <View style={styles.contenedorSuperior}>
            <View style={styles.contenedorNota}>
              <Image source={require('@/assets/images/star_filled.png')} style={styles.iconoEstrella}></Image>
              <Text style={styles.tarjetatexto}>{item.cualificacion}</Text>
            </View>
            <TouchableOpacity onPress={()=> manejarFavoritos(item._id)}>
              <Image source={favoritos.includes(item._id)
                ? require('@/assets/images/iconoFavActivo.png') 
                : require('@/assets/images/favoritosOff.png')} style={styles.iconoFav}></Image>
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
        <View style={styles.textos}>
          <Text style={styles.textoDescripcion2}>Restaurantes, supermercados y bares,</Text>
          <Text style={styles.titulos}>Encuentra en 1 minuto!</Text>
        </View>
        <View style={styles.bloqueBotones}>
          <View style={styles.contenedorBusqueda}>
            <TouchableOpacity>
              <View style={styles.buscadorContainer}>
                <TextInput style={styles.textoBuscador} placeholder='Busca locales sin gluten cerca...' value={busqueda} onChangeText={(texto) => setBusqueda(texto)} onSubmitEditing={() => manejarBusqueda(busqueda)} returnKeyType='search'></TextInput>
                <TouchableOpacity onPress={() => manejarBusqueda(busqueda)}>
                  <Image source={require('@/assets/images/Search.png')} style={styles.icono3}></Image>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            {busqueda.length > 0 && localesBusqueda.length > 0 && mostrarLista && (
              <View style={styles.menuBuscador}>
                <FlatList
                  data={localesBusqueda}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.textoLugar}
                      onPress={() => {
                        irLocal(item.latitud, item.longitud); 
                        // Cierra el desplegable
                        setLocalesBusqueda([item]); 
                        // Pone el nombre en el input
                        setBusqueda(item.nombre); 
                        setMostrarLista(false);
                      }}
                    >
                      <Text style={styles.textoBold}>{item.nombre}</Text>
                      <Text style={styles.textoBuscador}>{item.tipo}</Text>
                      <Image source={require('@/assets/images/Line.png')} style={styles.linea}></Image>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={() =>(
                    <TouchableOpacity onPress={mostrarLocalesCerca}>
                      <Text>Ver todos los sitios cerca</Text>
                    </TouchableOpacity>
                  )}
                /> 
              </View>
            )}
          </View>
        </View>
        <View style={styles.container3}>
          <MapView style={styles.mapa}
            ref={mapRef}
            region={region}
            // Permite que el usuario se mueva libremente después
            onRegionChangeComplete={setRegion} 
            provider="google"
            showsUserLocation={true}>
            {localesBusqueda.map((local) => (
            <Marker
              key={local._id}
              coordinate={{
                latitude: local.latitud,
                longitude: local.longitud,
              }}
              image={require('@/assets/images/PIN.png')}
              onPress={() => {
                setLocalSeleccionado(local);
                setModalLocal(true)
              }}
            >
          </Marker>
          ))}
          </MapView>
      </View>
      <View style={styles.containerMenu}>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Cafetería")}>
          <Image source={require('@/assets/images/iconoCafeteria.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Cafeterías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Panadería")}>
          <Image source={require('@/assets/images/iconoDesayuno.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Panaderías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorIconos} onPress={() => filtrarCategoria("Supermercado")}>
          <Image source={require('@/assets/images/iconoSuper.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Supermercados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorIconos}  onPress={() => filtrarCategoria("Restaurante")}>
          <Image source={require('@/assets/images/iconoRestaurante.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Restaurantes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textos}>
        <Text style={styles.titulos}>{titulosResultados}</Text>
      </View>
      <View style={styles.cajaScroll2}>
        {localesBusqueda.map((local) => (
          <View key={local._id}>
            {tarjeta({ item: local })}
          </View>
        ))}
      </View>
    </ScrollView> 
    <Modal visible={modalLocal}
      onRequestClose={() => setModalLocal(false)}
      animationType="fade"
      transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque}>
            {localSeleccionado ? (
            <TouchableOpacity 
              style={styles.tarjeta2} 
              onPress={() => {
                setModalLocal(false);
                router.push({ pathname: "/PantallaLocal", params: { id: localSeleccionado._id } });
              }}
            >
            <View style={styles.tarjetaContenedor}>
              <Image source={{ uri: localSeleccionado.foto }} style={styles.fotoTarjeta2}></Image>    
              <TouchableOpacity onPress={() => manejarFavoritos(localSeleccionado._id)}>
                <Image source={require('@/assets/images/favoritosOff.png')} style={styles.iconoFav2}></Image>
                </TouchableOpacity>              
                <TouchableOpacity onPress={() => setModalLocal(false)}>
                  <Image source={require('@/assets/images/volver.png')} style={styles.iconoVolver}></Image>
                </TouchableOpacity>
                <View style={styles.tarjetaInfo}>
                  <Text style={styles.tarjetaTitulo2}>{localSeleccionado.nombre}</Text>
                  <Text style={styles.tipoTarjeta}>{localSeleccionado.tipo}</Text>
                  <View style={styles.apartadosTarjeta}>
                    <Image source={require('@/assets/images/MapPin.png')} style={styles.iconoEstrella}></Image>
                    <Text style={styles.tarjetaTexto}>{localSeleccionado.direccion}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            /* Vista por si acaso el modal se abre por error sin datos */
            <View style={styles.modalBloque}>
              <Text>No se ha seleccionado ningún local</Text>
            </View>
          )}
          </View>
      </View>
    </Modal> 
    <Modal visible={alertaFav}
      onRequestClose={() => setAlertaFav(false)}
      animationType="fade"
      transparent={true}>
      <View style={styles.modalFondo2}>
        <View style={styles.modalBloque2}>
          <Image source={require('@/assets/images/iconoFavGris.png')} style={styles.iconoFav3}></Image>
          <Text style={styles.textoNotificacion}>{alertaMensaje}</Text>
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
  apartadosTarjeta:{
    display:"flex",
    flexDirection:"row",
    gap:5
  },
  iconoVolver:{
    height:35,
    width:35,
    position:"absolute",
    marginTop: -115,
    marginLeft:15
  },
  container3:{
    display:"flex",
  },
  tarjetaContenedor:{
    display:"flex",
    flexDirection:"column",
    gap:2
  },
  iconoFav2:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -50,
    marginLeft:220
  },
  contenedorBotones2:{
    display:"flex",
    flexDirection:"row",
    marginTop:20,
    gap:55
  },
  modalBloque:{
    backgroundColor:"#FFFFFF",
    paddingHorizontal:40,
    paddingTop:15,
    borderRadius:20,
    gap:10,
    width:350,
    height:300
  },
  modalBloque2:{
    display:"flex",
    flexDirection:"row",
    backgroundColor:"#FFFFFF",
    paddingLeft:20,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:20,
    gap:20,
    width:350,
    height:60,
    marginTop:500,
    alignContent:"flex-start",
    justifyContent:"flex-start",
    alignItems:"center"
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
  tarjeta2:{
    padding:10,
    display:"flex",
    flexDirection:"column",
    gap:10,
    marginBottom:10,
    width:330,
    alignSelf:"center",
    margin:0
  },
  iconoFav:{
    height:30,
    width:30,
    marginTop:-3
  },
  modalFondo:{
    backgroundColor:"rgba(0,0,0,0.5)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  modalFondo2:{
    backgroundColor:"rgba(0,0,0,0.2)",
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
  iconoEstrella:{
    height:15,
    width:15
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
  tarjetaTitulo2:{
    fontSize:20,
    fontWeight:700
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
    color:"#6d6464ff"
  },
  fotoTarjeta:{
    width:120,
    height:120,
    borderRadius:10
  },
  fotoTarjeta2:{
    width:310,
    height:120,
    borderRadius:10
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
    margin:3,
  },
  cajaScroll2:{
    marginLeft:10,
    marginRight:10,
    height:430,
    marginTop:15
  },
  menuBuscador:{
    position:"absolute",
    zIndex:1000,
    backgroundColor:"#ffffff",
    marginTop:270,
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
    width:350,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  contenedorBusqueda:{
    marginBottom:10,
    marginTop:30,
    display:"flex",
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
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
  textoNotificacion:{
    fontSize:16
  },
  iconoFav3:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
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
    marginTop:20,
    marginLeft:5
  },
  textos:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    marginRight:60, 
    marginTop:10,
    textAlign:"center",
    color:"black",
    gap:5
  },
  bloqueBotones:{
    display:"flex",
    flexDirection:"column",
    marginLeft:10,
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
    marginLeft:-30   
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
    fontSize: 20,
    marginLeft:10
  }
});
