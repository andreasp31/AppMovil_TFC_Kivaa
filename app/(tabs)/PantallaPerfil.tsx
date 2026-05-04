import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter, Stack} from 'expo-router';

export default function PantallaPerfil() {
  //Para cambiar entre pantallas
  const router = useRouter();
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style= {styles.containerCabecera}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <View style={styles.contenedorSalir}>
          <Image source={require('@/assets/images/LogOut.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>Salir</Text>
        </View>
      </View>
      <View style = {styles.contenedorTexto}>
        <Text style={styles.titulos}>Mi Cuenta</Text>
        <Text style={styles.textoDescripcion2}>Modifica los datos de tu perfil</Text>
      </View>
      <View style = {styles.bloquePrincipal}>
        <View style = {styles.contenedorSuperior}>
          <View style = {styles.bloqueFoto}>
            <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
            <Image source={require('@/assets/images/iconoPerfil.png')} style={styles.iconoFoto}></Image>
          </View>
          <View style = {styles.contenedorBloque}>
            <View style = {styles.contenedorApartado}>
              <View style = {styles.contenedorTextos}>
                <Text>Nombre</Text>
                <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
              </View>
              <Text style={styles.titulos}>Andrea Sofía</Text>
            </View>
            <View style = {styles.contenedorApartado}>
              <View style = {styles.contenedorTextos}>
                <Text>Apellidos</Text>
                <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
              </View>
              <Text style={styles.titulos}>Pais Dos Santos</Text>
            </View>
          </View>
        </View>
        <View style = {styles.contenedorInferior}>
          <View style = {styles.contenedorApartado}>
            <View style = {styles.contenedorTextos}>
              <Text>Correo</Text>
              <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
            </View>
            <Text>a******@gmail.com</Text>
          </View>
          <View style = {styles.contenedorApartado}>
            <View style = {styles.contenedorTextos}>
              <Text>Contraseña</Text>
              <Image source={require('@/assets/images/EditBoton.png')} style={styles.iconoEditar}></Image>
            </View>
            <Text>**************</Text>
          </View>
        </View>
      </View>
      <View style = {styles.contenedorBotones}>
        <TouchableOpacity style = {styles.Boton1}>
          <Text>Eliminar Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.Boton2}>
          <Text>Actualizar</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginTop:10
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
  contenedorBloque:{
    display:"flex",
    flexDirection:"column",
    gap:15
  },
  bloquePrincipal:{
    marginTop:20
  },
  contenedorSuperior:{
    display:"flex",
    flexDirection:"row",
    gap:20
  },
  contenedorBotones:{
    display:"flex",
    flexDirection:"row",
    marginTop:250,
    gap:40
  },
  contenedorInferior:{
    display:"flex",
    flexDirection:"row",
    gap:40,
    marginTop:30
  },
  contenedorTextos:{
    display:"flex",
    flexDirection:"row",
    gap:10
  },
  contenedorApartado:{
    display:"flex",
    flexDirection:"column",
    gap:5
  },
  containerCabecera:{
    display:"flex",
    flexDirection:"row",
    gap:120,
    marginTop:60,
    alignItems:"center"
  },
  contenedorTexto:{
    display:"flex",
    flexDirection:"column",
    alignSelf:"flex-start",
    marginLeft:40
  },
  contenedorSalir:{
    display:"flex",
    flexDirection:"row",
    gap:7,
    borderWidth:1,
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:20,
    alignContent:"center",
    height:35
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
  bloqueFoto:{
    display:"flex",
    flexDirection:"column",
  },
  iconoFoto:{
    width:100,
    height:100
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
    textAlign:"left",
    color:"#110501",     
    fontSize: 16,    
  },
  textoDescripcion2: {
    textAlign: "center", 
    color:"#110501",     
    fontSize: 14,
    marginBottom: 5,    
  },
  icono:{
    height:20,
    width:20
  },
  iconoEditar:{
    height:15,
    width:15
  },
  foto: {
    marginLeft:-40,
    width: 150,
    height:75,
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
  }
});