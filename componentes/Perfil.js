import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const traerDatos = async () => {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombre(data.nombre || '');
        setFecha(data.fecha || '');
        setTelefono(data.telefono || '');
      } else {
        Alert.alert('Usuario no encontrado');
      }

      setCargando(false);
    };

    traerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, {
        nombre,
        fecha,
        telefono,
      });
      Alert.alert('Datos actualizados');
    } catch (error) {
      console.error(error);
      Alert.alert('Error al actualizar');
    }
  };

  if (cargando) return <Text style={styles.cargando}>Cargando...</Text>;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Perfil del Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#FFD54F"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        placeholderTextColor="#FFD54F"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#FFD54F"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.boton} onPress={actualizarDatos}>
        <Text style={styles.textoBoton}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 20,
    flex: 1,
    backgroundColor: '#0D47A1', // Azul héroe
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFEB3B', // Amarillo héroe
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 25,
  },
  input: {
    borderWidth: 2,
    borderColor: '#D32F2F', // Rojo héroe
    backgroundColor: '#1E3A8A', // Azul oscuro elegante
    color: '#FFF',
    padding: 12,
    marginBottom: 18,
    borderRadius: 12,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#D32F2F', // rojo
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#FFEB3B', // amarillo
    fontSize: 18,
    fontWeight: 'bold',
  },
  cargando: {
    marginTop: 50,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 20,
  },
});
