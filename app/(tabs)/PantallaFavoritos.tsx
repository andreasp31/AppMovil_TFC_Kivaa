import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Local {
  _id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  plazas: number;
  horarios: string[];
  fechaHora: string;
  foto: string;
  calificacion: number;
  tipo: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [favoritos, setFavoritos] = useState<Local[]>([]);
  const [alertaFav, setAlertaFav] = useState(false);
  const [sugeridos, setSugeridos] = useState<Local[]>([]);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  
  useFocusEffect(
    useCallback(() => {
      const datosUsuario = async () => {
        try {
          const nombre = await AsyncStorage.getItem("nombreUsuario");
          const usuarioId = await AsyncStorage.getItem("idUsuario");
          if (nombre) {
            setNombreUsuario(nombre);
          }
          if (usuarioId) {
            const resultado = await axios.get(`http://10.0.2.2:3000/api/locales/favoritos/${usuarioId}`);
            setFavoritos(resultado.data);
            const resultadosLocales = await axios.get("http://10.0.2.2:3000/api/locales");
            setSugeridos(resultadosLocales.data);
          }
        } catch (error) {
          console.error("Error al cargar los datos", error);
        }
      };
      datosUsuario();
    }, [])
  );
  
  const manejarFavoritos = async (localId: string) => {
    try {
      const usuarioId = await AsyncStorage.getItem("idUsuario");
      console.log("ID del Local enviado:", localId);
      console.log("ID del Usuario recuperado de AsyncStorage:", usuarioId);
      const resultado = await axios.post("http://10.0.2.2:3000/api/locales/favorito", {
        localId,
        usuarioId
      });

      // Lógica dinámica para actualizar estados visuales inmediatamente
      const yaEsFavorito = favoritos.some(local => local._id === localId);
      if (yaEsFavorito) {
        setFavoritos(favoritos.filter(local => local._id !== localId));
      } else {
        const localAnadido = sugeridos.find(local => local._id === localId);
        if (localAnadido) {
          setFavoritos([...favoritos, localAnadido]);
        }
      }

      setSugeridos([...sugeridos]);
      setAlertaFav(true);
      setAlertaMensaje(resultado.data.message);
      setTimeout(() => {
        setAlertaFav(false);
      }, 1500);
    } catch (error) {
      console.error("Error al gestionar los favoritos", error);
      setAlertaFav(true);
      setAlertaMensaje("Hubo el error al guardar en favoritos");
      setTimeout(() => {
        setAlertaFav(false);
      }, 2500);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style={styles.containerCabecera} onPress={() => router.push("/PantallaPerfil")}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto} />
        <View style={styles.contenedorCuenta}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono} />
          <Text style={styles.textoDescripcion}>{nombreUsuario}</Text>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.titulos}>
        {favoritos.length === 0 ? "Descubre Locales" : "Mis Favoritos"}
      </Text>

      {favoritos.length === 0 ? (
        <FlatList
          data={sugeridos}
          keyExtractor={(item) => item._id}
          style={styles.listaScroll}
          contentContainerStyle={styles.scrollContenido}
          ListHeaderComponent={
            <View style={{ alignItems: 'center', width: '100%' }}>
              <View style={styles.contenedorOpcion}>
                <Image source={require('@/assets/images/favorite.png')} style={styles.iconoCorazon} />
                <Text style={styles.textoBold}>Aún no has añadido ningún local a favoritos.</Text>
              </View>
              <Text style={styles.textoExplorar}>Explora los mejores locales</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tarjeta} onPress={() => router.push({ pathname: "/PantallaLocal", params: { id: item._id } })}>
              <Image source={{ uri: item.foto }} style={styles.fotoTarjeta} />
              <View style={styles.tarjetaContenedor}>
                <View style={styles.contenedorSuperior}>
                  <View style={styles.contenedorNota}>
                    <Image source={require('@/assets/images/star_filled.png')} style={styles.iconoEstrella} />
                    <Text style={styles.tarjetatexto}>{item.calificacion}</Text>
                  </View>
                  <TouchableOpacity onPress={() => manejarFavoritos(item._id)}>
                    <Image 
                      source={favoritos.some(local => local._id === item._id)
                        ? require('@/assets/images/iconoFavActivo.png') 
                        : require('@/assets/images/favoritosOff.png')
                      } 
                      style={styles.iconoFav} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.tarjetaInfo}>
                  <Text style={styles.tarjetaTitulo}>{item.nombre}</Text>
                  <Text style={styles.tipoTarjeta}>{item.tipo}</Text>
                  <View style={styles.apartadosTarjeta}>
                    <Image source={require('@/assets/images/MapPin.png')} style={styles.iconoEstrella} />
                    <Text style={styles.tarjetaTexto}>{item.direccion}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item._id}
          style={styles.listaScroll}
          contentContainerStyle={styles.scrollContenido}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tarjeta} onPress={() => router.push({ pathname: "/PantallaLocal", params: { id: item._id } })}>
              <Image source={{ uri: item.foto }} style={styles.fotoTarjeta} />
              <View style={styles.tarjetaContenedor}>
                <View style={styles.contenedorSuperior}>
                  <View style={styles.contenedorNota}>
                    <Image source={require('@/assets/images/star_filled.png')} style={styles.iconoEstrella} />
                    <Text style={styles.tarjetatexto}>{item.calificacion}</Text>
                  </View>
                  <TouchableOpacity onPress={() => manejarFavoritos(item._id)}>
                    <Image 
                      source={favoritos.some(local => local._id === item._id)
                        ? require('@/assets/images/iconoFavActivo.png') 
                        : require('@/assets/images/favoritosOff.png')
                      } 
                      style={styles.iconoFav} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.tarjetaInfo}>
                  <Text style={styles.tarjetaTitulo}>{item.nombre}</Text>
                  <Text style={styles.tipoTarjeta}>{item.tipo}</Text>
                  <View style={styles.apartadosTarjeta}>
                    <Image source={require('@/assets/images/MapPin.png')} style={styles.iconoEstrella} />
                    <Text style={styles.tarjetaTexto}>{item.direccion}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={alertaFav} onRequestClose={() => setAlertaFav(false)} animationType="fade" transparent={true}>
        <View style={styles.modalFondo2}>
          <View style={styles.modalBloque2}>
            <Image source={require('@/assets/images/iconoFavGris.png')} style={styles.iconoFav2} />
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
  tarjeta: {
    borderWidth: 1,
    borderColor: "#9C9696",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    width: 330,
    alignSelf: "center",
    marginTop: 5
  },
  textoExplorar: {
    marginTop: 20, 
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 35
  },
  iconoCorazon: {
    height: 40,
    width: 40
  },
  contenedorOpcion: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 20
  },
  listaScroll: {
    width: "100%",
    height: 550,
    flexGrow: 0,
  },
  scrollContenido: {
    paddingBottom: 40, 
  },
  iconoFav2: {
    height: 30,
    width: 30,
    position: "absolute",
    marginTop: -40,
    marginLeft: 315
  },
  tipoTarjeta: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#9C9696",
    color: "#9C9696",
    width: 120,
    padding: 3,
    textAlign: "center",
    fontSize: 13
  },
  container2: {
    flex: 1,
    alignItems: "center",
    marginTop: 10
  },
  modalFondo2: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoNotificacion: {
    fontSize: 16
  },
  modalBloque2: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 20,
    gap: 40,
    width: 350,
    height: 60,
    marginTop: 500,
    alignItems: "center"
  },
  apartadosTarjeta: {
    flexDirection: "row",
    gap: 5
  },
  tarjetaTexto: {
    fontSize: 12,
    color: "#9C9696"
  },
  tarjetatexto: {
    fontSize: 12,
    fontWeight: '600'
  },
  tarjetaInfo: {
    flexDirection: "column",
    gap: 10,
  },
  iconoFav: {
    height: 30,
    width: 30,
    marginTop: -3
  },
  containerCabecera: {
    flexDirection: "row",
    gap: 160,
    marginTop: 60
  },
  tarjetaTitulo: {
    fontSize: 16,
    fontWeight: '600'
  },
  iconoEstrella: {
    height: 15,
    width: 15
  },
  contenedorNota: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FAD934",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  contenedorCuenta: {
    flexDirection: "column",
    gap: 5
  },
  contenedorSuperior: {
    flexDirection: "row",
    width: 180,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5
  },
  contenedorIconos: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4
  },
  tarjetaContenedor: {
    flexDirection: "column",
    gap: 2
  },
  fotoTarjeta: {
    width: 120,
    height: 120,
    borderRadius: 10
  },
  containerMenu: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20
  },
  textos: {
    flexDirection: "column",
    justifyContent: "flex-start", 
    marginTop: 20,
    color: "black",
    gap: 5
  },
  miTextoBoton: {
    color: "#110501",
  },
  textoDescripcion: {
    textAlign: "center", 
    color: "#110501",     
    fontSize: 12,
    marginBottom: 5,    
  },
  textoDescripcion2: {
    textAlign: "center", 
    color: "#110501",     
    fontSize: 14,
    marginBottom: 5,    
  },
  icono: {
    height: 50,
    width: 50
  },
  foto: {
    marginLeft: -40,
    width: 150,
    resizeMode: "contain"
  },
  foto2: {
    bottom: 0,            
    height: 340,
    width: 550,
    resizeMode: "contain",
  },
  textoBold: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  containerFotos: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 70
  },
  titulos: {
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: "flex-start",
    marginLeft: 35,
    marginBottom: 20
  }
});