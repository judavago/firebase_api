import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

// Tus componentes
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Home from './componentes/Home';
import OriginalHeroes from './componentes/OriginalHeroes';
import Perfil from './componentes/Perfil';
import Logout from './componentes/Logout';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          // 🎨 ESTILOS DEL TAB BAR SUPERHÉROE (mejorado)
          tabBarStyle: {
            backgroundColor: '#0a0f29',     // azul oscuro estilo Batman
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
            paddingTop: 6,

            position: "absolute",
            left: 10,
            right: 10,
            bottom: 40,         // 🔥 separa el menú de los botones del sistema
            borderRadius: 20,   // 🔥 esquinas redondeadas
            elevation: 10,
            marginHorizontal: 10,
          },

          tabBarActiveTintColor: '#ffcc00',   // amarillo superhéroe (Wolverine)
          tabBarInactiveTintColor: '#a5b3c4', // gris suave

          // 🦸 ÍCONOS POR SECCIÓN
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "OriginalHeroes") {
              iconName = focused ? "flash" : "flash-outline";
            } else if (route.name === "Perfil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Logout") {
              iconName = focused ? "exit" : "exit-outline";
            } else if (route.name === "Login") {
              iconName = focused ? "log-in" : "log-in-outline";
            } else if (route.name === "Registro") {
              iconName = focused ? "person-add" : "person-add-outline";
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >

        {usuario ? (
          <>
            <Tab.Screen name="Home" component={Home} options={{ title: "Home" }} />
            <Tab.Screen name="OriginalHeroes" component={OriginalHeroes} options={{ title: "Batallas" }} />
            <Tab.Screen name="Perfil" component={Perfil} options={{ title: "Perfil" }} />
            <Tab.Screen name="Logout" component={Logout} options={{ title: "Salir" }} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} options={{ title: "Login" }} />
            <Tab.Screen name="Registro" component={Registro} options={{ title: "Registro" }} />
          </>
        )}

      </Tab.Navigator>
    </NavigationContainer>
  );
}
