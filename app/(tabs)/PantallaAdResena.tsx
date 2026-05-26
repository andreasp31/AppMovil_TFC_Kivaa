import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, Modal, TextInput} from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
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

export default function PantallaAdminResena() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [numeroResenas, setNumeroResenas] = useState('');
  const [numeroUsuarios, setNumeroUsuarios] = useState('');
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [localesBusqueda, setLocalesBusqueda] = useState<Local[]>([]);
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text

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
        <View style={styles.contenedorCuenta}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.contenedorDatos}>
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo}>{numeroUsuarios}</Text>
          <Text style={styles.textoDescripcion}>Usuarios Totales</Text>
        </View>
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo}>{numeroResenas}</Text>
          <Text style={styles.textoDescripcion}>Locales Totales</Text>
        </View> 
      </View>
      <Text>Menu</Text>
      <TouchableOpacity>
        <View style={styles.buscadorContainer}>
          <TextInput style={styles.textoDescripcion} placeholder='Busca el local para ver sus reseñas...' value={busqueda} onChangeText={(texto) => setBusqueda(texto)} returnKeyType='search'></TextInput>
          <TouchableOpacity>
            <Image source={require('@/assets/images/Search.png')} style={styles.icono3}></Image>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.contenedorGeneral}>
      </View>
      <View style={styles.cajaScroll2}>
        {localesBusqueda.map((local) => (
          <View key={local._id}>
            {tarjeta({ item: local })}
          </View>
        ))}
          </View>
      <Modal>

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
  apartadosTarjeta:{
    display:"flex",
    flexDirection:"row",
    gap:5
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
    justifyContent:"space-between"
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
    fontSize: 14,
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
    marginLeft:35
  }
});
