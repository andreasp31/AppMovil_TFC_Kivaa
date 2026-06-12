import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function PantallaAdmin() {
  //Para cambiar entre pantallas
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [numeroLocales, setNumeroLocales] = useState<number>(0);
  const [numeroUsuarios, setNumeroUsuarios] = useState<number>(0);
  const [modalNuevoLocal, setModalNuevoLocal] = useState(false);
  const [modalCerrarSesion, setCerrarSesion] = useState(false);
  const [nombre, setNombre] = useState('');
  const [direccionLocal, setDireccionLocal] = useState('');
  const [webLocal, setWebLocal] = useState('');
  const [latitudLocal, setLatitudLocal] = useState('');
  const [longitudLocal, setLongitudLocal] = useState('');
  const [horarioLocal, setHorarioLocal] = useState('');
  const [fotoLocal, setFotoLocal] = useState<string | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const [estaEnFoco, setEstaEnFoco] = useState(false);
  const [campoActivo, setCampoActivo] = useState<string | null>(null);
  const [textoApertura, setTextoApertura] = useState('08:00');
  const [textoCierre, setTextoCierre] = useState('15:00');
  //modales de los selectores de hora
  const [mostrarHoraApertura, setMostrarHoraApertura] = useState(false);
  const [mostrarHoraCierre, setMostrarHoraCierre] = useState(false);
  const [horaApertura, setHoraApertura] = useState<Date>(new Date());
  const [horaCierre, setHoraCierre] = useState<Date>(new Date());
  const [alertaActualizar, setAlertaActualizar] = useState(false);

  const opciones = [
    {label: "Restaurante", value: "Restaurante"},
    {label: "Cafetería", value: "Cafetería"},
    {label: "Panadería", value: "Panadería"},
    {label: "Supermercado", value: "Supermercado"}
  ];

  //lo que se va a mostrar en pantalla: uso botones, imágenes y text

  useEffect(()=>{
    const seleccionarEstadisticas = async()=>{
      try{
        const respuesta = await axios.get("http://10.0.2.2:3000/api/admin/estadisticas");
        setNumeroLocales(respuesta.data.locales);
        setNumeroUsuarios(respuesta.data.usuarios);
      }
      catch(error){
        console.error("Error al cargar estadísticas:", error);
      }
    }
    seleccionarEstadisticas();
  },[])


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

  const cambiarHoraApertura = (event: DateTimePickerEvent, date?: Date) => {
    if(date){
      const horas = date.getHours().toString().padStart(2,"0");
      const minutos = date.getMinutes().toString().padStart(2,"0");
      setTextoApertura(`${horas}:${minutos}`);
    }
    else if (event.type === 'dismissed') {
      setMostrarHoraApertura(false);
      setCampoActivo(null);
    }
  }

  const cambiarHoraCierre = (event: DateTimePickerEvent, date?: Date) => {
    if(date){
      const horas = date.getHours().toString().padStart(2,"0");
      const minutos = date.getMinutes().toString().padStart(2,"0");
      setTextoCierre(`${horas}:${minutos}`);
    }
    else if (event.type === 'dismissed') {
      setMostrarHoraCierre(false);
      setCampoActivo(null);
    }
  }

  const seleccionarImagen = async() => {
    //solicitar permisos para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Necesitamos permisos de la galería para que esto funcione.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      //solo fotos no videos
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!resultado.canceled) {
      setFotoLocal(resultado.assets[0].uri);
    }
  }

  const guardarLocal = async () =>{
    if (!nombre || !tipoSeleccionado || !direccionLocal || !latitudLocal || !longitudLocal) {
      alert("Todos los campos obligatorios.");
      return;
    }
    const horario = `${textoApertura} - ${textoCierre}`;
    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("tipo", tipoSeleccionado);
    formData.append("direccion", direccionLocal.trim());
    formData.append("web", webLocal.trim());
    formData.append("latitud", latitudLocal);
    formData.append("longitud", longitudLocal);
    formData.append("horarios", horario);
    if (fotoLocal) {
      const nombreArchivo = fotoLocal.split('/').pop() || 'local_foto.jpg';
      const matchExtension = /\.(\w+)$/.exec(nombreArchivo);
      const tipoArchivo = matchExtension ? `image/${matchExtension[1]}` : `image/jpeg`;

      formData.append('foto', {
        uri: fotoLocal,
        name: nombreArchivo,
        type: tipoArchivo,
      } as any);
    }
    try{
      const respuesta = await axios.post("http://10.0.2.2:3000/api/locales/crear", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlertaActualizar(true);
      setNumeroLocales(prev => prev + 1);
      setModalNuevoLocal(false);
      setNombre('');
      setTipoSeleccionado(null);
      setDireccionLocal('');
      setWebLocal('');
      setLatitudLocal('');
      setLongitudLocal('');
      setFotoLocal(null);
      setTextoApertura('08:00');
      setTextoCierre('15:00');
      setAlertaActualizar(true);
        setTimeout(() => {
        setAlertaActualizar(false);
      }, 1500);
    }
    catch(error){
      console.error("Error al guardar el local", error);
    }
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style= {styles.containerCabecera}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <TouchableOpacity style={styles.contenedorCuenta} onPress={() => setCerrarSesion(true)}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.contenedorDatos}>
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo2}>{numeroLocales}</Text>
          <Text style={styles.textoDescripcion}>Locales Activos</Text>
        </View> 
        <View style={styles.contenedorInfo}>
          <Text style={styles.datosInfo2}>{numeroUsuarios}</Text>
          <Text style={styles.textoDescripcion}>Total de Usuarios</Text>
        </View>
      </View>
      <Text style={styles.textoBold}>Menu</Text>
      <View style={styles.contenedorGeneral}>
        <TouchableOpacity  style={styles.contenedorInfo2} onPress={() => setModalNuevoLocal(true)}>
          <Image source={require('@/assets/images/nuevoLocal.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Añadir Local</Text>
            <Text>Crear un nuevo establecimiento</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo2} onPress={() => router.push("/PantallaAdEdit")}>
          <Image source={require('@/assets/images/editarLocal.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Editar Local</Text>
            <Text>Modificar cualquier información</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo2} onPress={() => router.push("/PantallaAdBorrar")}>
          <Image source={require('@/assets/images/eliminarLocal.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Borrar Local</Text>
            <Text>Eliminar por inactividad o cierre</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contenedorInfo2} onPress={() => router.push("/PantallaAdResena")}>
          <Image source={require('@/assets/images/botonResena.png')} style={styles.iconos}></Image>
          <View style={styles.contenedorTexto}>
            <Text style={styles.datosInfo}>Borrar Reseñas</Text>
            <Text>Eliminar comentarios maliciosos</Text>
          </View>
        </TouchableOpacity>
      </View>
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
      <Modal visible={modalNuevoLocal}
      onRequestClose={() => setModalNuevoLocal(false)}
      animationType="fade"
      transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque2}>
            <Text style={styles.datosInfo}>Nuevo Local</Text>
            <ScrollView nestedScrollEnabled={true} 
            showsVerticalScrollIndicator={false} 
            style={styles.contenedorInput}>
              <View style={styles.subContenedor}>
                <View style={[styles.subContenedor0, estaEnFoco && { borderColor: '#FAD934' }]}>
                  <Text style={styles.texto}>Nombre</Text>
                  <TextInput style={styles.input1} placeholder='Nombre' value={nombre} onChangeText={setNombre}></TextInput>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Tipo</Text>
                  <Dropdown
                      style={[styles.dropdown, estaEnFoco && { borderColor: '#FAD934' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      containerStyle={styles.listaDesplegable}
                      data={opciones}
                      maxHeight={200}
                      labelField="label"
                      valueField="value"
                      placeholder={!estaEnFoco ? 'Selecciona una opción...' : '...'}
                      value={tipoSeleccionado}
                      onFocus={() => setEstaEnFoco(true)}
                      onBlur={() => setEstaEnFoco(false)}
                      onChange={item => {
                        setTipoSeleccionado(item.value);
                        setEstaEnFoco(false);
                      }}
                    />
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Dirección</Text>
                  <TextInput style={styles.input1} placeholder='Introduce la dirección...' value={direccionLocal} onChangeText={setDireccionLocal}></TextInput>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Página Web</Text>
                  <TextInput style={styles.input1} placeholder='Introduce la web' value={webLocal} onChangeText={setWebLocal}></TextInput>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Latitud</Text>
                  <TextInput style={styles.input1} placeholder='Introduce la latitud...' value={latitudLocal} onChangeText={setLatitudLocal}></TextInput>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Longitud</Text>
                  <TextInput style={styles.input1} placeholder='Introduce la longitud' value={longitudLocal} onChangeText={setLongitudLocal}></TextInput>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Horario</Text>
                  <View style={styles.subContenedor1}>
                      <TouchableOpacity style={styles.input2} onPress={()=>{
                        setMostrarHoraApertura(true);}}>
                        <Text style={styles.textoCentro}>{textoApertura}</Text>
                      </TouchableOpacity>
                      <Text>-</Text>
                      <TouchableOpacity style={styles.input2} onPress={()=>{
                        setMostrarHoraCierre(true);}}>
                        <Text style={styles.textoCentro}>{textoCierre}</Text>
                      </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.subContenedor0}>
                  <Text style={styles.texto}>Foto</Text>
                  <TouchableOpacity style={styles.contenedorFoto} onPress={seleccionarImagen}>
                    {fotoLocal ? (
                      // Si hay foto, la pintamos ocupando todo el recuadro
                      <View style={styles.marcadorTexto}>
                        <Image source={{ uri: fotoLocal }} style={styles.vistaFotos}/>
                        <Text style={styles.textoSub}>Pulsa para cambiar la imagen</Text>
                      </View>
                      
                    ) : (
                      // Si no hay foto, mostramos un diseño limpio de marcador de posición
                      <View style={styles.marcadorTexto}>
                        <Image style={styles.icono2}  source={require('@/assets/images/Camera.png')}></Image>
                        <Text style={styles.textoSub}>Pulsa para añadir una imagen</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            
            <View style = {styles.contenedorBotones2}>
              <TouchableOpacity style = {styles.Boton1} onPress={() => setModalNuevoLocal(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.Boton2} onPress={guardarLocal}>
                <Text>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {mostrarHoraApertura && (
        <DateTimePicker  style={styles.modalSelector} value={horaApertura} mode="time" display="spinner" is24Hour={true} onChange={cambiarHoraApertura}></DateTimePicker>
      )}
      {mostrarHoraCierre && (
        <DateTimePicker value={horaCierre} mode="time" display="spinner" is24Hour={true} onChange={cambiarHoraCierre}></DateTimePicker>
      )}
      <Modal visible={alertaActualizar}
        onRequestClose={() => setAlertaActualizar(false)}
        animationType="fade"
        transparent={true}>
        <View style={styles.modalFondo2}>
          <View style={styles.modalBloque3}>
            <Image source={require('@/assets/images/editAlerta.png')} style={styles.iconoEdit}></Image>
            <Text style={styles.textoNotificacion}>Se ha creado el local correctamente</Text>
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
  contenedorFoto:{

  },
  textoNotificacion:{
    fontSize:16
  },
  iconoEdit:{
    height:30,
    width:30,
    position:"absolute",
    marginTop: -40,
    marginLeft:315
  },
  vistaFotos:{
    height:30,
    width:100,
    paddingBottom:50
  },
  textoSub:{
    fontSize:14
  },
  modalFondo2:{
    backgroundColor:"rgba(0,0,0,0.2)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    height:750,
  },
  marcadorTexto:{
    display:"flex",
    flexDirection:"row",
    alignContent:"center",
    justifyContent:"center",
    alignItems:"center",
    gap:10,
    paddingBottom:50
  },
  modalSelector:{
    borderWidth:10,
    borderRadius:10
  },
  textoCentro:{
    alignSelf:"center"
  },
  dropdown: {
    height: 50,
    borderColor: "#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    paddingHorizontal: 20,
    width: 300,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#9C9696",
  },
  subContenedor1:{
    display:"flex",
    flexDirection:"row",
    gap:8,
    alignItems:"center"
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#110501",
  },
  listaDesplegable: {
    borderRadius: 15,
    marginTop: 5,
    borderWidth: 0.5,
    borderColor: "#110501",
    backgroundColor: "white",
  },
  fondoInfo:{
    backgroundColor:"#FAD934",
    width:400,
    height:60,
    marginTop:-50
  },
  picker:{
    fontSize:10
  },
  contenedorPicker:{
    borderColor:"#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    width:300,
    height:45,
    paddingLeft:15,
    paddingBottom:5
  },
  input1:{
    borderColor:"#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    width:300,
    height:45,
    paddingLeft:15,
  },
  input2:{
    borderColor:"#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    width:140,
    height:45,
    display:"flex",
    textAlign:"center",
    justifyContent:"center",
    alignContent:"center"
  },
  contenedorInput:{
    width:320,
    marginTop:15,
    maxHeight: 380, 
    alignSelf: "center",
    paddingLeft:10,
    paddingVertical:10
  },
  texto:{
    fontSize:15
  },
  iconos:{
    height:70,
    width:70
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
  modalBloque2:{
    backgroundColor:"#FFFFFF",
    paddingHorizontal:20,
    paddingVertical:30,
    borderRadius:20,
    gap:10,
    alignItems:"center",
  },
  modalBloque3:{
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
  contenedorBotones2:{
    display:"flex",
    flexDirection:"row",
    marginTop:20,
    gap:55
  },
  contenedorTexto:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center"
  },
  contenedorGeneral:{
    display:"flex",
    flexDirection:"column",
    gap:15,
    marginTop:15
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
    gap:20,
    marginTop:25,
    marginBottom:10
  },
  contenedorInfo:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"flex-start",
    borderRadius:20,
    borderWidth:0.5,
    paddingHorizontal:30,
    paddingVertical:10,
    backgroundColor:"#FFFFFF"
  },
  contenedorInfo2:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-start",
    borderRadius:20,
    borderWidth:0.5,
    gap:15,
    paddingRight:20,
    paddingLeft:15,
    paddingVertical:15,
    backgroundColor:"#FFFFFF"
  },
  datosInfo:{
    fontSize:16,
    fontWeight:700
  },
  datosInfo2:{
    fontSize:20,
    fontWeight:700
  },
  contenedorIconos:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:4
  },
  subContenedor:{
    display:"flex",
    flexDirection:"column",
    gap:15
  },
  subContenedor0:{
    display:"flex",
    flexDirection:"column",
    gap:8
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
  textoNombreApartado: {
    textAlign: "left", 
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
    height:20,
    width:20
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
