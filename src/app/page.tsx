"use client";

import React, { useEffect, useState } from "react";
import LeaderboardTable, { Player } from "@/components/LeaderboardTable";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState("witcher");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch(`/api/players?game=${gameVersion}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch players: ${res.status}`);
        }
        const data: Player[] = await res.json();
        setPlayers(data);
        setError(null); // clear previous errors
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [gameVersion]);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gwent Leaderboard</h1>
      <select value={gameVersion} onChange={(e) => setGameVersion(e.target.value)} className="mb-4 p-2 border rounded">
        <option value="witcher">Witcher</option>
        <option value="got">Game of Thrones</option>
        <option value="lotr">Lord of the Rings</option>
      </select>
      <LeaderboardTable players={players} gameVersion={gameVersion} />
    </div>
  );
}
