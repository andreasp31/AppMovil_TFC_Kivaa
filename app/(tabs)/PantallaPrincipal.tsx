import { Image } from 'expo-image';
import { KivaaBoton } from '../../components/KivaaBoton';
import {StyleSheet, View, Text, ScrollView, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter, Stack, useFocusEffect} from 'expo-router';
import { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Restaurante {
  _id: string;
  nombre: string;
  descripcion: string;
  clasificacion: number;
  horarios: string[];
  fechaHora: string;
}

export default function HomeScreen() {
  //Para cambiar entre pantallas
  const router = useRouter();
  //lo que se va a mostrar en pantalla: uso botones, imágenes y text
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style= {styles.containerCabecera}>
        <Image source={require('@/assets/images/logoKivaa.png')} style={styles.foto}></Image>
        <View style={styles.contenedorCuenta}>
          <Image source={require('@/assets/images/iconoCuenta.png')} style={styles.icono}></Image>
          <Text style={styles.textoDescripcion}>Nombre</Text>
        </View>
      </View>
      <View style={styles.textos}>
        <Text style={styles.textoDescripcion2}>Restaurantes, supermercados y bares,</Text>
        <Text style={styles.titulos}>Encuentra en 1 minuto!</Text>
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
    alignItems: 'center',
    marginTop:10
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
