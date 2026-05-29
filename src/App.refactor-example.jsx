
import { useState } from "react";

import "./styles/global.css";

import AppShell from "./app/AppShell";

import CharacterScreen from "./features/character/CharacterScreen";
import InventoryScreen from "./features/inventory/InventoryScreen";
import QuestScreen from "./features/quests/QuestScreen";
import FactionsPanel from "./features/factions/FactionsPanel";

export default function HeroJournal() {

  const [tab, setTab] = useState("character");

  const [char, setChar] = useState({
    name: "Arthos",
    classes: [{ level: 5 }]
  });

  const [inventory] = useState([
    { id: 1, name: "Miecz" },
    { id: 2, name: "Mikstura" }
  ]);

  const [quests] = useState([
    { id: 1, title: "Pokonaj nekromantę" }
  ]);

  const [factions] = useState([
    { id: 1, name: "Zakon Srebrnego Płomienia" }
  ]);

  const renderTab = () => {
    switch (tab) {
      case "inventory":
        return <InventoryScreen inventory={inventory} />;

      case "quests":
        return <QuestScreen quests={quests} />;

      case "factions":
        return <FactionsPanel factions={factions} />;

      default:
        return (
          <CharacterScreen
            char={char}
            setChar={setChar}
          />
        );
    }
  };

  return (
    <AppShell
      navigation={
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <button onClick={() => setTab("character")}>
            Bohater
          </button>

          <button onClick={() => setTab("inventory")}>
            Plecak
          </button>

          <button onClick={() => setTab("quests")}>
            Zadania
          </button>

          <button onClick={() => setTab("factions")}>
            Frakcje
          </button>
        </div>
      }
    >
      {renderTab()}
    </AppShell>
  );
}
