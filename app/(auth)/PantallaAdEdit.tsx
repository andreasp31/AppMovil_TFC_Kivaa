import { Image } from 'expo-image';
import {StyleSheet, View, TouchableOpacity, Text, Modal, TextInput, ScrollView, FlatList} from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import React,{ useState, useEffect,useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

interface Local {
  _id: string;
  nombre: string;
  tipo: string;     
  direccion: string;
  enlace: string; 
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
  const [mostrarHoraApertura, setMostrarHoraApertura] = useState(false);
  const [mostrarHoraCierre, setMostrarHoraCierre] = useState(false);
  const [horaApertura, setHoraApertura] = useState<Date>(new Date());
  const [horaCierre, setHoraCierre] = useState<Date>(new Date());
  const [fotoLocal, setFotoLocal] = useState<string | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const [estaEnFoco, setEstaEnFoco] = useState(false);
  const [modalEditarLocal, setModalEditarLocal] = useState(false);
  const [direccionLocal, setDireccionLocal] = useState('');
  const [webLocal, setWebLocal] = useState('');
  const [latitudLocal, setLatitudLocal] = useState('');
  const [longitudLocal, setLongitudLocal] = useState('');
  const [horarioLocal, setHorarioLocal] = useState('');
  const [nombre, setNombre] = useState('');
  const [textoApertura, setTextoApertura] = useState('08:00');
  const [textoCierre, setTextoCierre] = useState('15:00');
  const [alertaActualizar, setAlertaActualizar] = useState(false);
  const [campoActivo, setCampoActivo] = useState<string | null>(null);
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text

  const opciones = [
    {label: "Restaurante", value: "Restaurante"},
    {label: "Cafetería", value: "Cafetería"},
    {label: "Panadería", value: "Panadería"},
    {label: "Supermercado", value: "Supermercado"}
  ];

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

  const abrirEditor = (local: Local) => {
    setLocalSeleccionada(local);
    setNombre(local.nombre);
    setTipoSeleccionado(local.tipo);
    setDireccionLocal(local.direccion);
    setWebLocal(local.enlace);
    setLatitudLocal(local.latitud.toString());
    setLongitudLocal(local.longitud.toString());
    setFotoLocal(local.foto || null);
    const horarioTexto = (local as any).horario;
    if (horarioTexto && horarioTexto.includes('-')) {
    const partes = horarioTexto.split("-");
    const aperturaTexto = partes[0].trim(); 
    const cierreTexto = partes[1].trim();
    setTextoApertura(aperturaTexto);
    setTextoCierre(cierreTexto);
    //El picker necesita objetos data
    const [horaA, minA] = aperturaTexto.split(':').map(Number);
    const [horaC, minC] = cierreTexto.split(':').map(Number);

    const fApertura = new Date(); fApertura.setHours(horaA, minA, 0, 0);
    const fCierre = new Date(); fCierre.setHours(horaC, minC, 0, 0);
    
    setHoraApertura(fApertura);
    setHoraCierre(fCierre);
    }
    else{
      setTextoApertura('08:00');
      setTextoCierre('15:00');
      const dA = new Date(); dA.setHours(8, 0, 0, 0);
      const dC = new Date(); dC.setHours(15, 0, 0, 0);
      setHoraApertura(dA);
      setHoraCierre(dC);
    }
    setModalEditarLocal(true);
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
  const cambiarHoraApertura = (event: DateTimePickerEvent, date?: Date) => {
    setMostrarHoraApertura(false); 
    setCampoActivo(null);
    if(date){
      setHoraApertura(date);
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
      setMostrarHoraCierre(false);
      setCampoActivo(null);
      if(date){
        setHoraCierre(date);
        const horas = date.getHours().toString().padStart(2,"0");
        const minutos = date.getMinutes().toString().padStart(2,"0");
        setTextoCierre(`${horas}:${minutos}`);
      }
      else if (event.type === 'dismissed') {
        setMostrarHoraCierre(false);
        setCampoActivo(null);
      }
     }

  const actualizarLocal = async () =>{
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
    formData.append("horario", horario);
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
      const respuesta = await axios.put(`http://10.0.2.2:3000/api/locales/actualizar/${localSeleccionada?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setModalEditarLocal(false);
      const reconsultar = await axios.get(`http://10.0.2.2:3000/api/locales`);
      setLocales(reconsultar.data);
      setLocalesBusqueda(reconsultar.data);
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
      console.error("Error al actualizar el local", error);
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
              <TouchableOpacity style={styles.contenedorIcono} onPress={()=>abrirEditor(item)}>
                <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
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
            <Text style={styles.textoBold2}>{ localSeleccionada ? localSeleccionada.nombre: "Actualizar Local"}</Text>
            <Text style={styles.textoDescripcion4}>¿Seguro que quieres actualizar este local?</Text>
            <View style = {styles.contenedorBotones2}>
              <TouchableOpacity style = {styles.Boton1} onPress={() => setModalVisible2(false)}>
                <Text>No, cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.Boton2} onPress={() => actualizarLocal()}>
                <Text>Sí, actualizar</Text>
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
      <Modal visible={modalEditarLocal}
      onRequestClose={() => setModalEditarLocal(false)}
      animationType="fade"
      transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalBloque2}>
            <Text style={styles.datosInfo}>Editar Local</Text>
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
              <TouchableOpacity style = {styles.Boton1} onPress={() => setModalEditarLocal(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.Boton2} onPress={actualizarLocal}>
                <Text>Actualizar</Text>
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
          <View style={styles.modalBloque4}>
            <Image source={require('@/assets/images/editAlerta.png')} style={styles.iconoEdit}></Image>
            <Text style={styles.textoNotificacion}>Se ha actualizado el local correctamente</Text>
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
    alignSelf:"flex-end",
    display:"flex",
    flexDirection:"row",
    gap:10
  },
  apartadosTarjeta:{
    display:"flex",
    flexDirection:"row",
    gap:5
  },
  modalFondo: {
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 750,
  },
  modalBloque2: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    gap: 10,
    alignItems: "center",
  },
  contenedorInput: {
    width: 320,
    marginTop: 15,
    maxHeight: 380, 
    alignSelf: "center",
    paddingLeft: 10,
    paddingVertical: 10,
  },
  subContenedor: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  subContenedor0: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  texto: {
    fontSize: 15,
  },
  input1: {
    borderColor: "#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    width: 300,
    height: 45,
    paddingLeft: 15,
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
  modalSelector:{
    borderWidth:10,
    borderRadius:10
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#9C9696",
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
  subContenedor1: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input2: {
    borderColor: "#110501",
    borderWidth: 0.5,
    borderRadius: 15,
    width: 140,
    height: 45,
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  textoCentro: {
    alignSelf: "center",
  },
  contenedorFoto: {
  },
  marcadorTexto: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingBottom: 50,
  },
  vistaFotos: {
    height: 30,
    width: 100,
    paddingBottom: 50,
  },
  textoSub: {
    fontSize: 14,
  },
  icono2: {
    height: 60,
    width: 60,
  },
  contenedorBotones2: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    gap: 55,
  },
  Boton1: {
    borderWidth: 1,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
  },
  Boton2: {
    paddingHorizontal: 45,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#FAD934",
  },
  datosInfo: {
    fontSize: 16,
    fontWeight: "700",
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
  modalBloque4:{
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
  listaContenidoInterno: {
    paddingBottom: 30
  },
  iconoVolver:{
    height:35,
    width:35,
    marginRight:300
  },
  contenedorSuperior:{
    display:"flex",
    flexDirection:"row",
    width:180,
    alignItems:"center",
    justifyContent:"flex-end",
    alignContent:"center",
    gap:10
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
    height:20,
    width:20,
    marginBottom:2
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
