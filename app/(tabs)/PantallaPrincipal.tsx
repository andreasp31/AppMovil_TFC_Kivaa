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
  clasificacion?: number;
}

export default function PantallaPrincipal() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [localesBusqueda, setLocalesBusqueda] = useState<Local[]>([]);
  const mapRef = React.useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: 40.4167,
    longitude: -3.70325,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
  (async () => {
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
  })();
  // Función para los locales
  const obtenerLocales = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:3000/api/locales");
      setLocales(res.data);
    } catch (error) {
      console.error("Error cargando locales:", error);
    }
  };
}, []);

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

  //Mover el mapa al toca el local de la lista
  const irLocal = (lat:number, lng: number) =>{
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000)
  };

  //Función para buscar local
  const manejarBusqueda = (texto: string) =>{
    setBusqueda(texto);
    const filtrados = locales.filter(item => item.nombre.toLocaleLowerCase().includes(texto.toLocaleLowerCase()));
    setLocalesBusqueda(filtrados);
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
      <View style={styles.textos}>
        <Text style={styles.textoDescripcion2}>Restaurantes, supermercados y bares,</Text>
        <Text style={styles.titulos}>Encuentra en 1 minuto!</Text>
      </View>
      <View style={styles.bloqueBotones}>
        <TouchableOpacity>
          <View style={styles.botonfiltro}>
            <Image source={require('@/assets/images/Filter.png')} style={styles.icono3}></Image>
            <Text style={styles.textoBlanco}>Filtrar</Text>
          </View>
        </TouchableOpacity> 
        <TouchableOpacity>
          <View style={styles.buscadorContainer}>
            <TextInput style={styles.textoBuscador} placeholder='Busca locales sin gluten cerca...' value={busqueda} onChangeText={manejarBusqueda}></TextInput>
          </View>
        </TouchableOpacity>
        <Text></Text>
      </View>
      <View style={styles.container3}>
        <MapView style={styles.mapa}
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
            title={local.nombre}
            description={local.tipo}
          >
          <Callout>
            <View style={{ padding: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{local.nombre}</Text>
              <Text>{local.direccion}</Text>
              <Text style={{ color: 'blue' }}>Ver detalles</Text>
            </View>
          </Callout>
        </Marker>
        ))}
        </MapView>
      </View>
      <View style={styles.containerMenu}>
        <View style={styles.contenedorIconos}>
          <Image source={require('@/assets/images/iconoCafeteria.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Cafeterías</Text>
        </View>
        <View style={styles.contenedorIconos}>
          <Image source={require('@/assets/images/iconoDesayuno.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Panaderías</Text>
        </View>
        <View style={styles.contenedorIconos}>
          <Image source={require('@/assets/images/iconoSuper.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Supermercados</Text>
        </View>
        <View style={styles.contenedorIconos}>
          <Image source={require('@/assets/images/iconoRestaurante.png')} style={styles.icono2}></Image>
          <Text style={styles.textoDescripcion}>Restaurantes</Text>
        </View>
      </View>
      <View style={styles.textos}>
        <Text style={styles.titulos}>Resultados</Text>
      </View>
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
  buscadorContainer:{
    borderWidth:1,
    borderRadius:20,
    paddingHorizontal:30,
    paddingVertical:2,
    width:320
  },
  textoBuscador:{

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
