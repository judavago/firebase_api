import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState({});
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json");
        const json = await res.json();
        setData(json);

        // Clasificar por publisher
        const clasificados = {};

        json.forEach(hero => {
          const publisher = hero.biography.publisher || "Desconocido";

          if (!clasificados[publisher]) clasificados[publisher] = [];

          clasificados[publisher].push(hero);
        });

        setGroups(clasificados);
      } catch (error) {
        console.log("Error cargando superheroes:", error);
      }
    };

    obtenerDatos();
  }, []);

  const toggleSection = (publisher) => {
    setOpenSections(prev => ({
      ...prev,
      [publisher]: !prev[publisher]
    }));
  };

  return (
    <ScrollView style={styles.scroll}>
      
      {/* TÍTULO PRINCIPAL */}
      <Text style={styles.homeTitle}>SUPERHÉROES</Text>

      {Object.keys(groups).map((publisher, index) => (
        <View key={index} style={styles.section}>
          
          {/* Título de sección */}
          <TouchableOpacity onPress={() => toggleSection(publisher)}>
            <Text style={[styles.sectionTitle, styles.getPublisherColor(publisher)]}>
              {publisher} ({groups[publisher].length})
            </Text>
          </TouchableOpacity>

          {/* Contenido expandible */}
          {openSections[publisher] && (
            <View style={styles.lista}>
              {groups[publisher].map((heroe) => (
                <View key={heroe.id} style={styles.item}>
                  <Text style={styles.nombre}>{heroe.id} - {heroe.name}</Text>

                  <Image
                    source={{ uri: heroe.images.sm }}
                    style={styles.imagen}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { 
    padding: 10,
    paddingTop: 30,
    backgroundColor: "#0A0A0A", // Fondo oscuro estilo cómic
  },

  homeTitle: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
    color: "#F4D03F",
    textShadowColor: "#FF0000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  section: {
    marginBottom: 20,
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
    textAlign: "center",
    color: "#fff",
  },

  // 🎨 COLORES POR EDITORIAL
  getPublisherColor: (publisher) => ({
    backgroundColor:
      publisher.includes("Marvel") ? "#ED1D24" :         // rojo
      publisher.includes("DC") ? "#0070FF" :             // azul
      "#8E44AD",                                         // púrpura por defecto
  }),

  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
  },

  item: {
    backgroundColor: '#1C1C1C',
    width: '48%',
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  nombre: {
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
    fontSize: 16,
    color: "#F4D03F",
  },

  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
