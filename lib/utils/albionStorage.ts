import type { AlbionFormInput } from "@/lib/schema/albion";

export interface AlbionPlayerData extends AlbionFormInput {
  id: string;
  createdAt: string;
}

const STORAGE_KEY = "albion_players";

// Get all players from localStorage
export function getAllPlayers(): AlbionPlayerData[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

// Save a new player
export function savePlayer(data: AlbionFormInput): AlbionPlayerData {
  const players = getAllPlayers();
  const newPlayer: AlbionPlayerData = {
    ...data,
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  players.push(newPlayer);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw new Error("Gagal menyimpan data");
  }
  
  return newPlayer;
}

// Delete a player by ID
export function deletePlayer(id: string): boolean {
  const players = getAllPlayers();
  const filtered = players.filter((p) => p.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting from localStorage:", error);
    return false;
  }
}

// Get player by ID
export function getPlayerById(id: string): AlbionPlayerData | null {
  const players = getAllPlayers();
  return players.find((p) => p.id === id) || null;
}

// Update player by ID
export function updatePlayer(id: string, data: Partial<AlbionFormInput>): AlbionPlayerData | null {
  const players = getAllPlayers();
  const index = players.findIndex((p) => p.id === id);
  
  if (index === -1) return null;
  
  players[index] = {
    ...players[index],
    ...data,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    return players[index];
  } catch (error) {
    console.error("Error updating localStorage:", error);
    return null;
  }
}


export function updateFocusByTime(dailyGain: number = 10000): number {
  const players = getAllPlayers();
  const focusPerHour = dailyGain / 24;
  let updatedCount = 0;

  players.forEach((player) => {
    const createdAt = new Date(player.createdAt).getTime();
    const now = Date.now();
    const hoursElapsed = (now - createdAt) / (1000 * 60 * 60);
    
    // Hitung focus yang bertambah
    const focusGained = hoursElapsed * focusPerHour;
    const newFocus = Math.min(30000, player.focusRightNow + focusGained);
    
    // Update jika ada perubahan
    if (newFocus !== player.focusRightNow && newFocus < 30000) {
      player.focusRightNow = Math.floor(newFocus);
      player.createdAt = new Date().toISOString(); // Update timestamp untuk reset perhitungan
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    } catch (error) {
      console.error("Error updating focus:", error);
    }
  }

  return updatedCount;
}