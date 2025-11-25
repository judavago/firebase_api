import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function OriginalHeroesFight() {
  const [heroes, setHeroes] = useState([]);
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);

  const [progress, setProgress] = useState(50);
  const [fighting, setFighting] = useState(false);
  const [winner, setWinner] = useState(null);
  const [battleLog, setBattleLog] = useState("");

  useEffect(() => {
    const fetchHeroes = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json"
      );
      const json = await res.json();
      setHeroes(json);
    };

    fetchHeroes();
  }, []);

  const selectHero = (hero) => {
    if (!fighter1) setFighter1(hero);
    else if (!fighter2 && hero.id !== fighter1.id) setFighter2(hero);
  };

  const resetFight = () => {
    setFighter1(null);
    setFighter2(null);
    setWinner(null);
    setBattleLog("");
    setProgress(50);
    setFighting(false);
  };

  const calculatePower = (h) => {
    const p = h.powerstats;
    return (
      (p.intelligence || 0) +
      (p.strength || 0) +
      (p.speed || 0) +
      (p.durability || 0) +
      (p.power || 0) +
      (p.combat || 0)
    );
  };

  const startFight = () => {
    setWinner(null);
    setBattleLog("");
    setProgress(50);
    setFighting(true);

    const p1 = calculatePower(fighter1);
    const p2 = calculatePower(fighter2);

    let timer = 0;

    const interval = setInterval(() => {
      timer += 0.5;

      const variation = Math.random() * 4;
      let newProgress = progress;

      if (p1 > p2) newProgress += variation;
      else if (p2 > p1) newProgress -= variation;
      else newProgress += (Math.random() - 0.5) * 2;

      newProgress = Math.max(0, Math.min(newProgress, 100));

      setProgress(newProgress);

      if (timer >= 10) {
        clearInterval(interval);
        setFighting(false);

        const winnerHero =
          newProgress > 50 ? fighter1 : newProgress < 50 ? fighter2 : null;

        if (winnerHero) {
          setWinner(winnerHero);

          // 💬 Explicación del ganador
          const stronger = winnerHero.powerstats.strength;
          const smarter = winnerHero.powerstats.intelligence;
          const faster = winnerHero.powerstats.speed;
          const combat = winnerHero.powerstats.combat;
          const power = winnerHero.powerstats.power;

          let reason = "";

          if (stronger > 80)
            reason += "Tiene una fuerza descomunal. 💪 ";
          if (smarter > 80)
            reason += "Su inteligencia táctica domina la pelea. 🧠 ";
          if (faster > 80)
            reason += "Es demasiado rápido para su oponente. ⚡ ";
          if (combat > 80)
            reason += "Su habilidad de combate es superior. 🥋 ";
          if (power > 80)
            reason += "Posee un poder extraordinario. 🔥⚡ ";

          if (reason === "")
            reason = "Sus estadísticas generales fueron más altas.";

          setBattleLog(`${winnerHero.name} gana porque: ${reason}`);
        } else {
          setBattleLog("¡Empate perfecto! 😱🤝");
        }
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Batalla de Superhéroes</Text>

      {/* Selección */}
      <View style={styles.selectedRow}>
        <View style={styles.selectedBox}>
          <Text style={styles.boxLabel}>Jugador 1</Text>
          {fighter1 ? (
            <Image source={{ uri: fighter1.images.sm }} style={styles.selImg} />
          ) : (
            <Text style={styles.placeholder}>---</Text>
          )}
        </View>

        <View style={styles.selectedBox}>
          <Text style={styles.boxLabel}>Jugador 2</Text>
          {fighter2 ? (
            <Image source={{ uri: fighter2.images.sm }} style={styles.selImg} />
          ) : (
            <Text style={styles.placeholder}>---</Text>
          )}
        </View>
      </View>

      {fighter1 && fighter2 && !fighting && !winner && (
        <TouchableOpacity style={styles.btnFight} onPress={startFight}>
          <Text style={styles.btnFightTxt}>🔥 ¡PELEAR! 🔥</Text>
        </TouchableOpacity>
      )}

      {/* Barra de pelea */}
      {fighting && (
        <View style={styles.progressContainer}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
      )}

      {/* Resultado */}
      {winner && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🏆 Ganador</Text>
          <Image source={{ uri: winner.images.md }} style={styles.winnerImg} />
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.log}>{battleLog}</Text>

          <TouchableOpacity style={styles.btnReset} onPress={resetFight}>
            <Text style={styles.btnResetTxt}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista */}
      <ScrollView style={{ marginTop: 20 }}>
        <View style={styles.grid}>
          {heroes.map((hero) => (
            <TouchableOpacity
              key={hero.id}
              style={styles.card}
              onPress={() => selectHero(hero)}
            >
              <Image source={{ uri: hero.images.xs }} style={styles.cardImg} />
              <Text style={styles.cardName}>{hero.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    padding: 15,
    paddingTop: 35,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#F4D03F",
    marginBottom: 20,
    textShadowColor: "#FF0000",
    textShadowRadius: 3,
    textShadowOffset: { width: 2, height: 2 },
  },

  selectedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  selectedBox: {
    width: "48%",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
  },

  boxLabel: {
    color: "#F4D03F",
    fontWeight: "bold",
    marginBottom: 5,
  },

  placeholder: { color: "#777" },

  selImg: {
    width: 90,
    height: 90,
  },

  btnFight: {
    backgroundColor: "#ED1D24",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  btnFightTxt: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 18,
  },

  progressContainer: {
    marginTop: 15,
    width: "100%",
    height: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: "#F4D03F",
  },

  resultBox: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8E44AD",
    marginTop: 20,
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 22,
    color: "#F4D03F",
    fontWeight: "900",
  },

  winnerImg: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },

  winnerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  log: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 15,
  },

  btnReset: {
    backgroundColor: "#0070FF",
    padding: 12,
    borderRadius: 8,
  },

  btnResetTxt: {
    color: "#fff",
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#1C1C1C",
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  cardImg: { width: 80, height: 80 },

  cardName: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#F4D03F",
    textAlign: "center",
  },
});
