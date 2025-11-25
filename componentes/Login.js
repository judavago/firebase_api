import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#FFD54F"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#FFD54F"
        value={contrasena}
        onChangeText={setContrasena}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonSecundario}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.textoSecundario}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0D47A1', // Azul héroe
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFEB3B', // Amarillo héroe
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 2,
    borderColor: '#D32F2F', // Rojo héroe
    backgroundColor: '#1E3A8A', // Azul oscuro
    color: '#FFF',
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#FFEB3B',
    fontWeight: 'bold',
    fontSize: 18,
  },
  botonSecundario: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  textoSecundario: {
    color: '#FFEB3B',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
