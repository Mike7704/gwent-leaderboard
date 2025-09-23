type FactionInfo = { name: string; total: number };
type FactionData = Record<string, Record<string, FactionInfo>>;

// Data for each game version and its factions
const factionData: FactionData = {
  classic: {
    neutral: { name: "Neutral", total: 26 },
    special: { name: "Special", total: 18 },
    faction1: { name: "Northern Realms", total: 123 },
    faction2: { name: "Nilfgaard", total: 85 },
    faction3: { name: "Scoia'tael", total: 82 },
    faction4: { name: "Monsters", total: 110 },
    faction5: { name: "Skellige", total: 85 },
  },
  got: {
    neutral: { name: "Neutral", total: 46 },
    special: { name: "Special", total: 18 },
    faction1: { name: "House Targaryen", total: 90 },
    faction2: { name: "Black Loyalists", total: 118 },
    faction3: { name: "Green Loyalists", total: 96 },
    faction4: { name: "Beyond the Wall", total: 81 },
    faction5: { name: "Sons of Essos", total: 82 },
  },
  lotr: {
    neutral: { name: "Neutral", total: 19 },
    special: { name: "Special", total: 16 },
    faction1: { name: "Kingdoms of Men", total: 104 },
    faction2: { name: "Dwarves & Elves", total: 100 },
    faction3: { name: "Servants of Evil", total: 103 },
    faction4: { name: "N/A", total: 0 },
    faction5: { name: "N/A", total: 0 },
  },
};

// Returns the faction name and total cards for a given game version and faction
export function getFactionHeader(gameVersion: string, factionKey: string): string {
  const gameFactions = factionData[gameVersion];
  const faction = gameFactions[factionKey];

  if (!gameFactions || !faction) return "N/A (0)";

  return `${faction.name} (${faction.total})`;
}

// Returns the total number of cards for a given game version
export function getTotalCards(gameVersion: string): number {
  const factions = factionData[gameVersion];
  return Object.values(factions).reduce((sum, f) => sum + f.total, 0);
}
